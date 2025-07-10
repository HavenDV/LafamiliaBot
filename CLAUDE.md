# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development Commands

- **Dev server**: `npm run dev` (uses Turbopack for faster builds)
- **Build**: `npm run build`
- **Start production**: `npm start`
- **Lint**: `npm run lint`

## Architecture Overview

This is a Next.js 15 Telegram bot for the LaFamilia mafia club that handles:

1. **Daily voting polls** - Automated daily messages (8 AM cron) asking members to select their preferred game time
2. **Interactive time selection** - Inline keyboard buttons for time registration with real-time message updates
3. **AI joke generation** - OpenAI-powered humor responses when the bot is mentioned or replied to

### Core Components

- **Webhook Handler** (`/api/telegram/webhook/route.ts`): Main bot logic handling both callback queries (button presses) and mentions
- **Cron Job** (`/api/telegram/create-poll/route.ts`): Daily automated voting message sender
- **Telegram API Layer** (`/lib/telegram/api.ts`): Type-safe wrapper for Telegram Bot API calls
- **Message Utilities** (`/lib/telegram/message-utils.ts`): Complex message parsing and updating logic for user registrations
- **OpenAI Integration** (`/lib/openai.ts`): Humor generation using GPT model with Russian system prompt

### Key Features

- **Edge Runtime**: Both API routes use edge runtime for zero cold-start
- **Concurrent Operations**: Uses Promise.all for parallel API calls (callback answers + message edits)
- **Message State Management**: Sophisticated parsing/updating of inline message content to track user registrations
- **User Normalization**: Handles both @username mentions and display names consistently
- **Moscow Timezone**: All time operations use Europe/Moscow timezone

### Environment Variables Required

- `TELEGRAM_BOT_TOKEN`: Bot token from @BotFather
- `CHAT_ID`: Target chat ID for daily voting messages
- `OPENAI_API_KEY`: For joke generation feature

### Deployment Configuration

- **Vercel**: Configured with cron jobs and function timeouts in `vercel.json`
- **Webhook timeout**: 60 seconds for processing
- **Daily cron**: 8 AM Moscow time (`0 8 * * *`)

### Telegram Message Flow

1. Daily cron sends voting message with time selection buttons
2. Users click buttons → callback queries update message content in real-time
3. Message parsing extracts existing registrations to avoid duplicates
4. User mentions trigger OpenAI joke responses with conversation context