export default async function handler(req, res) {
  try {
    const url = process.env.UPSTREAM_API_URL;

    const response = await fetch(url, {
      headers: {
        "Cache-Control": "no-cache",
        "Pragma": "no-cache",
      },
    });

    const raw = await response.text();

    console.log("Upstream status:", response.status);
    console.log("Upstream URL:", response.url);
    console.log(
      "Upstream cache headers:",
      Object.fromEntries(response.headers.entries())
    );
    console.log("Upstream body:", raw);

    if (!response.ok) {
      return res.status(502).json({
        error: "Upstream request failed",
        status: response.status,
      });
    }

    res.setHeader(
      "Cache-Control",
      "no-store, max-age=0"
    );

    res.setHeader("X-Debug-Fetch-Time", new Date().toISOString());

    return res.status(200).send(raw);
  } catch (error) {
    console.error("Fetch error:", error);

    return res.status(500).json({
      error: "Failed to fetch upstream JSON",
    });
  }
}
