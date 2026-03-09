/**
 * api/claude.js
 * Vercel serverless function — acts as a secure proxy between the React app
 * and the Anthropic API. The API key lives here, never in the browser.
 *
 * Endpoint: POST /api/claude
 * Headers required: x-mkf-pin: <APP_PIN>
 * Body: standard Anthropic messages payload
 */

export default async function handler(req, res) {
  // ── CORS ──────────────────────────────────────────────────────────────────
  // Allow requests only from your own Vercel domain.
  // Update this to your actual domain once deployed.
  const allowedOrigins = [
    process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null,
    'http://localhost:3000', // local development
  ].filter(Boolean);

  const origin = req.headers.origin || '';
  if (allowedOrigins.some(o => origin.startsWith(o.replace('https://', '')))) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, x-mkf-pin');

  // Handle preflight
  if (req.method === 'OPTIONS') return res.status(200).end();

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── PIN GATE ──────────────────────────────────────────────────────────────
  // The React app sends the PIN as a header when the user has authenticated.
  // This prevents anyone who bypasses the frontend PIN screen from using the API.
  const pin = req.headers['x-mkf-pin'];
  if (!pin || pin !== process.env.APP_PIN) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  // ── API KEY CHECK ─────────────────────────────────────────────────────────
  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY not set in environment variables');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // ── PROXY TO ANTHROPIC ────────────────────────────────────────────────────
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key':          process.env.ANTHROPIC_API_KEY,
        'anthropic-version':  '2023-06-01',
        'content-type':       'application/json',
      },
      body: JSON.stringify({
        // Enforce safe defaults — frontend can override model/max_tokens
        model:      req.body.model      || 'claude-sonnet-4-20250514',
        max_tokens: Math.min(req.body.max_tokens || 1024, 2048), // cap at 2048
        messages:   req.body.messages   || [],
        system:     req.body.system,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Anthropic API error:', data);
      return res.status(response.status).json({ error: data.error?.message || 'API error' });
    }

    return res.status(200).json(data);

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
