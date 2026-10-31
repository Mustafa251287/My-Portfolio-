
export default async function handler(request, response) {
  try {
    const baseUrl = process.env.UPSTREAM_API_URL;

    if (!baseUrl) {
      return response.status(500).json({
        error: "UPSTREAM_API_URL is not defined",
      });
    }

    // Diagnostic: use a unique URL for this request.
    const url = new URL(baseUrl);
    url.searchParams.set("_cb", Date.now().toString());

    const result = await fetch(url.toString(), {
      cache: "no-store",
      headers: {
        "Cache-Control": "no-cache, no-store",
        "Pragma": "no-cache",
      },
    });

    const raw = await result.text();

    console.log("Upstream status:", result.status);
    console.log("Upstream URL:", result.url);
    console.log("Cloudflare status:",
      result.headers.get("cf-cache-status"));
    console.log("Age:", result.headers.get("age"));
    console.log("ETag:", result.headers.get("etag"));
    console.log("Upstream body:", raw);

    if (!result.ok) {
      return response.status(502).json({
        error: "Upstream request failed",
        status: result.status,
      });
    }

    const data = JSON.parse(raw);

    // Avoid caching the response from this Vercel endpoint.
    response.setHeader(
      "Cache-Control",
      "no-store, max-age=0"
    );

    return response.status(200).json(data);
  } catch (error) {
    console.error("Function error:", error);

    return response.status(500).json({
      error: "Failed to fetch upstream JSON",
    });
  }
}
