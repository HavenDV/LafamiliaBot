import { NextResponse } from "next/server";
import {
  TelegramAPI,
  TIME_BUTTONS,
  VOTING_MESSAGE_TEMPLATE,
  MessageUtils,
} from "@/app/lib/telegram";

export const runtime = "edge";

export async function GET() {
  try {
    const timeString = MessageUtils.getCurrentMoscowTime();

    const result = await TelegramAPI.sendMessage({
      chat_id: process.env.CHAT_ID!,
      text: VOTING_MESSAGE_TEMPLATE,
      reply_markup: {
        inline_keyboard: TIME_BUTTONS,
      },
    });

    if (!result.ok) {
      console.error("Telegram API error:", result);
      return NextResponse.json(
        { error: "Failed to send message" },
        { status: 500 }
      );
    }

    console.log(`Voting message sent at ${timeString}`);
    return NextResponse.json({
      success: true,
      message_id: result.result.message_id,
      time: timeString,
    });
  } catch (error) {
    console.error("Error in cron job:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Prevent other HTTP methods
export async function POST() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PUT() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function DELETE() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}

export async function PATCH() {
  return NextResponse.json({ error: "Method not allowed" }, { status: 405 });
}
