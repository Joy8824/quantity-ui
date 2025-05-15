export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { session, files } = req.body;

  if (!session || !Array.isArray(files)) {
    return res.status(400).json({ error: 'Missing session or files' });
  }

  try {
    const makeWebhookUrl = 'https://hook.us2.make.com/pf34br22gx660i6jy4pmifbgb5ese96n'; // ← insert your Make webhook

    const response = await fetch(makeWebhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ session, files })
    });

    const result = await response.text(); // use .json() if your webhook returns JSON

    return res.status(200).json({ result });
  } catch (error) {
    console.error('Submit qty failed:', error);
    return res.status(500).json({ error: 'Failed to forward to Make' });
  }
}
