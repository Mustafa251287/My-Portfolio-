
import cookie from 'cookie';

export default async function handler(req, res) {
  // Accept only POST requests
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({
      error: "Method not allowed",
    });
  }

const cookies = cookie.parse(req.headers.cookie || '');

  // Verify session
  if (cookies.session !== 'authenticated_user') {
    return.status(401).json({ error: 'Unauthorized: Please log in first' });
  }

  // Validate environment variables
  const apiUrl = process.env.UPSTREAM_API_URL;
  const apiKey = process.env.UPSTREAM_API_KEY;

  if (!apiUrl || !apiKey) {
    return res.status(500).json({
      error: "Server configuration is missing",
    });
  }

  // Validate JSON body
  const data = req.body;

  if (
    data === undefined ||
    data === null ||
    typeof data !== "object"
  ) {
    return res.status(400).json({
      error: "Request body must be a JSON object or array",
    });
  }

  try {
    // Construct upstream URL
    const url = new URL(apiUrl);
    url.searchParams.set("apiKey", apiKey);

    // Forward JSON using PATCH
    const upstreamResponse = await fetch(url.toString(), {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // Read upstream response
    const responseText = await upstreamResponse.text();

    let responseData;
    try {
      responseData = responseText
        ? JSON.parse(responseText)
        : null;
    } catch {
      responseData = responseText;
    }

    // Forward upstream status and response
    return res.status(upstreamResponse.status).json({
      success: upstreamResponse.ok,
      data: responseData,
    });
  } catch (error) {
    console.error("Upstream API request failed:", error.message);

    return res.status(502).json({
      error: "Failed to communicate with upstream API",
    });
  }
}
