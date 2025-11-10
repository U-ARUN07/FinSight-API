import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(200).json({
      success: true,
      message: "FinSight API is running. Use POST /api/update to send data."
    });
  }

  try {
    const { username, data } = req.body;
    if (!username || !data) {
      return res.status(400).json({ error: "Missing username or data" });
    }

    const owner = "U-ARUN07"; // your GitHub username
    const repo = "FinSight";  // your frontend repo
    const token = process.env.GITHUB_TOKEN; // your PAT (from Vercel environment)

    const encodedData = Buffer.from(JSON.stringify(data, null, 2)).toString("base64");

    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/dispatches`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        event_type: "update-data",
        client_payload: { username, data: encodedData }
      })
    });

    if (!response.ok) {
      const text = await response.text();
      throw new Error(text);
    }

    res.status(200).json({ success: true, message: "Data saved successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
}
