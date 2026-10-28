export default async function handler(request, response) {
  try {
    const result = await fetch(process.env.UPSTREAM_API_URL);

    if (!result.ok) {
      return response.status(502).json({
        error: "API request failed"
      });
    }

    const data = await result.json();
    return response.status(200).json(data);
  } catch {
    return response.status(500).json({
      error: "Internal server error"
    });
  }
}
