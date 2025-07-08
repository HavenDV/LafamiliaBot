// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const update = await req.json();          // Telegram Update object
  const msg = update.message?.text ?? '';

  if (msg === '/ping') {
    // Quick reply – must finish in ~10 s or Telegram retries  [oai_citation:2‡core.telegram.org](https://core.telegram.org/bots/payments-stars?utm_source=chatgpt.com)
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: update.message.chat.id,
          text: 'pong 🏓'
        })
      }
    );
  }

  // Always ACK Telegram
  return NextResponse.json({ ok: true });
}