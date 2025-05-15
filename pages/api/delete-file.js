export default async function handler(req, res) {
  if (req.method !== 'POST')
    return res.status(405).json({ error: 'Method not allowed' });

  const { path_display, sessionId } = req.body;     //grab path_display

  if (!path_display)
    return res.status(400).json({error: 'Missing path_display'});

  try {
    const makeWebhook = 'https://hook.us2.make.com/YOUR-DELETE-WEBHOOK';

    const resp = await fetch(makeWebhook, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path_display, sessionId })
    });

    const json = await resp.json();   // Make can return whatever you like
    return res.status(200).json(json);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Delete failed' });
  }
}
