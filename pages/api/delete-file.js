export default async function handler(req, res) {
  const { id, session } = req.body;

  // Trigger a Make scenario to delete from Dropbox
  const response = await fetch('https://hook.us2.make.com/your-delete-webhook', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id, session })
  });

  const result = await response.text();
  res.status(200).json({ result });
}

