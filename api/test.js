export default async function handler(req, res) {
  const key = process.env.GEMINI_API_KEY;
  return res.status(200).json({
    hasKey: !!key,
    keyLength: key ? key.length : 0,
    keyStart: key ? key.slice(0, 6) : 'empty',
    allEnvKeys: Object.keys(process.env).filter(k => !k.includes('npm') && !k.includes('NODE')).join(', ')
  });
}
