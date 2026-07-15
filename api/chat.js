export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'No API key found' });

  try {
    const { contents } = req.body;
    if (!contents) return res.status(400).json({ error: 'No contents in request' });

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    
    const geminiRes = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents })
    });

    const raw = await geminiRes.text();
    
    if (!geminiRes.ok) {
      console.error('Gemini failed:', geminiRes.status, raw);
      return res.status(200).json({ text: `Debug: Gemini returned ${geminiRes.status} — ${raw.slice(0, 200)}` });
    }

    const data = JSON.parse(raw);
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response generated';
    return res.status(200).json({ text });

  } catch (err) {
    console.error('Error:', err.message);
    return res.status(200).json({ text: `Debug error: ${err.message}` });
  }
}
