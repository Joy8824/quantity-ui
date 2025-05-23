export default async function handler(req, res) {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session ID' });
  }

  try {
    const response = await fetch(
      `https://hook.us2.make.com/jd93nlb43ey4z22edjqwaab4nafjhdva?sessionId=${sessionId}`
    );

    if (!response.ok) {
      const text = await response.text();
      console.error('Make response not OK:', text);
      return res.status(500).json({ error: 'Make webhook error' });
    }

    /* ── read raw string then parse ─────────────────────────────── */
    const raw  = await response.text();   // <- plain text
    const data = JSON.parse(raw);         // <- convert to real JSON

    res.status(200).json(data);           //  { files:[ … ] }
  } catch (error) {
    console.error('Fetch error:', error);
    res.status(500).json({ error: 'Error fetching files', details: error.message });
  }
}
