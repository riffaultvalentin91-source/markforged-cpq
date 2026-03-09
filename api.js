/**
 * src/api.js
 * Thin wrapper around the /api/claude serverless proxy.
 * Import this wherever you want to call Claude from the React app.
 *
 * Usage:
 *   import { askClaude } from './api';
 *   const result = await askClaude([{ role: 'user', content: 'Summarise this quote...' }]);
 */

const PIN_KEY = 'mkf_auth_pin';

// Store the verified PIN in sessionStorage so we can send it as a header
export function setSessionPin(pin) {
  sessionStorage.setItem(PIN_KEY, pin);
}

export function getSessionPin() {
  return sessionStorage.getItem(PIN_KEY) || '';
}

/**
 * Call Claude via the secure server-side proxy.
 * @param {Array}  messages  - Anthropic messages array [{role, content}]
 * @param {string} system    - Optional system prompt
 * @param {Object} opts      - Optional overrides: { model, max_tokens }
 * @returns {Promise<string>} - The assistant's text response
 */
export async function askClaude(messages, system = '', opts = {}) {
  const pin = getSessionPin();

  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-mkf-pin': pin,
    },
    body: JSON.stringify({
      model:      opts.model      || 'claude-sonnet-4-20250514',
      max_tokens: opts.max_tokens || 1024,
      system:     system || undefined,
      messages,
    }),
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({}));
    throw new Error(err.error || `API error ${response.status}`);
  }

  const data = await response.json();
  // Return the first text block content
  return data.content?.find(b => b.type === 'text')?.text || '';
}

/**
 * Example: Ask Claude to generate a quote summary paragraph.
 * Call this from your CPQ app when you want an AI-generated summary.
 *
 * @param {Object} quoteData - { custName, lines, totalNet, grandTotal, ... }
 * @returns {Promise<string>}
 */
export async function generateQuoteSummary(quoteData) {
  const { custName, lines, totalNet, grandTotal, incoterm, qExpiry } = quoteData;

  const linesSummary = lines
    .filter(l => l.pData)
    .map(l => `${l.productName} ×${l.qty} — net ${l.lineNet.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}`)
    .join('\n');

  return askClaude([{
    role: 'user',
    content: `Write a concise 2-3 sentence professional quote summary for a Markforged sales quote.
Customer: ${custName}
Products:
${linesSummary}
Net total: $${totalNet.toLocaleString()}
Grand total (with handling/freight): $${grandTotal.toLocaleString()}
Incoterms: ${incoterm}
Valid until: ${qExpiry}

Keep it professional, factual, and under 60 words. Do not invent specs.`,
  }], 'You are a helpful Markforged sales assistant. Write concise, professional content.');
}
