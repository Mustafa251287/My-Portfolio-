export default async function handler(request, response) {
  try {
    // 1. Check if the environment variable exists
    if (!process.env.UPSTREAM_API_URL) {
      console.error("CRITICAL: UPSTREAM_API_URL is not defined");
      return response.status(500).json({ error: "Server configuration error" });
    }

    const result = await fetch(process.env.UPSTREAM_API_URL);

    if (!result.ok) {
      return response.status(502).json({
        error: "API request failed",
        status: result.status
      });
    }

    // 2. Safely parse JSON (handles cases where API returns non-JSON)
    const text = await result.text();
    let data;
    try {
      data = JSON.parse(text);
    } catch (parseError) {
      console.error("Failed to parse JSON:", text);
      return response.status(502).json({ error: "Upstream API returned invalid JSON" });
    }

    return response.status(200).json(data);
  } catch (error) {
    // 3. Log the actual error to Vercel Runtime Logs
    console.error("Function error:", error);
    return response.status(500).json({
      error: "Internal server error",
      details: error.message // Temporarily expose for debugging
    });
  }
}
