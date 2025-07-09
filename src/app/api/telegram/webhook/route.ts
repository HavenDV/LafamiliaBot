// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = 'edge';

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const update = await req.json();          // Telegram Update object
  const msg = update.message?.text ?? '';
  const callbackQuery = update.callback_query;

  // Handle button callbacks
  if (callbackQuery) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const data = callbackQuery.data;

    // Answer the callback query to remove loading state
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: callbackQuery.id,
          text: `You selected: ${data}`
        })
      }
    );

    // Edit the message to show the selection
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: chatId,
          message_id: messageId,
          text: `✅ You selected: ${data === 'true' ? 'True' : 'False'}`
        })
      }
    );

    return NextResponse.json({ ok: true });
  }

  if (msg === '/ping') {
    // Send message with inline keyboard buttons
    await fetch(
      `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: update.message.chat.id,
          text: 'Please select True or False:',
          reply_markup: {
            inline_keyboard: [
              [
                { text: 'True ✅', callback_data: 'true' },
                { text: 'False ❌', callback_data: 'false' }
              ]
            ]
          }
        })
      }
    );
  }

  // Always ACK Telegram
  return NextResponse.json({ ok: true });
}