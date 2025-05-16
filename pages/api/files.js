export default async function handler(req, res) {
  const { sessionId } = req.query;

  if (!sessionId) {
    return res.status(400).json({ error: 'Missing session ID' });
  }

  try {
    const response = await fetch(`https://hook.us2.make.com/jd93nlb43ey4z22edjqwaab4nafjhdva?sessionId=${sessionId}`);

    const text = await response.text();
    const files = JSON.parse(text); // Manually parse the JSON string from Make

    res.status(200).json(files);
  } catch (error) {
    console.error('Error fetching or parsing files:', error);
    res.status(500).json({ error: 'Error fetching files' });
  }
}
