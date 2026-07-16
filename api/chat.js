export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { systemPrompt, messages } = req.body;

    const contents = [
      { role: 'user',  parts: [{ text: systemPrompt || 'You are a helpful assistant.' }] },
      { role: 'model', parts: [{ text: 'Understood.' }] },
      ...(messages || []).slice(-10).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content || '' }]
      }))
    ];

    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents })
      }
    );

    const data = await geminiRes.json();
    
    if (!geminiRes.ok) {
      return res.status(200).json({ text: `Error: ${data?.error?.message || 'Unknown error'}` });
    }

    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text || 'No response';
    return res.status(200).json({ text });

  } catch (err) {
    return res.status(200).json({ text: `Error: ${err.message}` });
  }
}
