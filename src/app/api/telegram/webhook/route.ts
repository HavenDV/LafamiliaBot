// app/api/telegram/webhook/route.ts
// Edge runtime = zero cold-start for small handlers
export const runtime = "edge";

import { NextRequest, NextResponse } from "next/server";
import {
  TelegramAPI,
  TIME_BUTTONS,
  CALLBACK_MESSAGES,
  MessageUtils,
} from "@/app/lib/telegram";

export async function POST(req: NextRequest) {
  const update = await req.json();
  const callbackQuery = update.callback_query;

  // Handle button callbacks for time selection
  if (callbackQuery && callbackQuery.data?.startsWith("time_")) {
    const chatId = callbackQuery.message.chat.id;
    const messageId = callbackQuery.message.message_id;
    const selectedTime = callbackQuery.data.replace("time_", "");
    const user = callbackQuery.from;
    const displayName = user.username
      ? `<a href="https://t.me/${user.username}">@${user.username}</a>`
      : user.first_name || "Unknown";

    // Answer the callback query
    await TelegramAPI.answerCallbackQuery({
      callback_query_id: callbackQuery.id,
      text:
        selectedTime === "not_coming"
          ? CALLBACK_MESSAGES.NOT_COMING
          : CALLBACK_MESSAGES.REGISTERED(selectedTime),
    });

    // Parse current message and update with new user selection
    const currentText = callbackQuery.message.text;
    const updatedText = MessageUtils.updateMessageWithUserSelection(
      currentText,
      displayName,
      selectedTime
    );

    // Update the message
    await TelegramAPI.editMessageText({
      chat_id: chatId,
      message_id: messageId,
      text: updatedText,
      parse_mode: "HTML",
      reply_markup: {
        inline_keyboard: TIME_BUTTONS,
      },
    });

    return NextResponse.json({ ok: true });
  }

  // Always ACK Telegram
  return NextResponse.json({ ok: true });
}
