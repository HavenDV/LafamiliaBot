# LaFamilia Bot

A Telegram bot for the LaFamilia mafia club built with Next.js 15 and deployed on Vercel.

## Features

- **Daily Voting Polls**: Automated daily messages asking members to select their preferred game time
- **Interactive Time Selection**: Real-time message updates when users click time selection buttons
- **AI-Powered Humor**: OpenAI integration for generating jokes when the bot is mentioned

## Setup

### Environment Variables

Create a `.env.local` file with:

```bash
TELEGRAM_BOT_TOKEN=your_bot_token_from_botfather
CHAT_ID=your_telegram_chat_id
OPENAI_API_KEY=your_openai_api_key
```

### Development

```bash
npm install
npm run dev
```

The bot webhook will be available at `http://localhost:3000/api/telegram/webhook`

### Production Deployment

Deploy to Vercel with the included `vercel.json` configuration:

```json
{
  "functions": {
    "app/api/telegram/webhook/route.ts": { "maxDuration": 60 }
  },
  "crons": [
    {
      "path": "/api/telegram/create-poll",
      "schedule": "0 8 * * *"
    }
  ]
}
```

#### Vercel Configuration:

1. **Environment Variables**: Set the required variables in Vercel dashboard
2. **Webhook Timeout**: 60-second timeout for processing Telegram updates
3. **Cron Jobs**: Daily voting messages sent at 8 AM Moscow time (`0 8 * * *`)
4. **Edge Runtime**: Zero cold-start latency for instant responses

#### Telegram Bot Setup:

After deployment, set your webhook URL:
```bash
curl -X POST "https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-vercel-app.vercel.app/api/telegram/webhook"}'
```

## Architecture

Built on Next.js 15 with:

- **Edge Runtime**: Zero cold-start for instant responses
- **Telegram Bot API**: Type-safe wrapper for all bot operations  
- **OpenAI Integration**: GPT-powered humor generation in Russian
- **Vercel Cron**: Automated daily scheduling
- **Message State Management**: Complex parsing for user registration tracking

## Bot Commands

- Users click time buttons to register for mafia games
- Mention `@lafamilias_bot` for AI-generated jokes
- Reply to bot messages for contextual humor responses
