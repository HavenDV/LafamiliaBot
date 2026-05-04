# LaFamilia Bot

A Telegram bot for the LaFamilia mafia club built with Next.js 15 and deployed on Vercel.

## Features

- **Daily Voting Polls**: Automated daily messages asking members to select their preferred game time
- **Interactive Time Selection**: Real-time message updates when users click time selection buttons
- **AI-Powered Humor**: OpenAI integration for generating jokes when the bot is mentioned

## Setup

### Getting Required Credentials

#### 1. Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Start a chat and send `/newbot`
3. Follow the prompts to choose a name and username for your bot
4. Copy the bot token (format: `123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`)

#### 2. Telegram Chat ID

To get the chat ID where the bot will send daily polls:

1. Right-click on any message inside your target group/channel
2. Select "Copy Link"
3. The link will look like: `https://t.me/c/1234567890/123`
4. Take the number after `/c/` (e.g., `1234567890`)
5. Add `-100` prefix to get the chat ID: `-1001234567890`

#### 3. OpenAI API Key

1. Visit [OpenAI Platform](https://platform.openai.com/api-keys)
2. Create an account or sign in
3. Click "Create new secret key"
4. Copy the API key (starts with `sk-`)

### Environment Variables

Create a `.env.local` file with:

```bash
TELEGRAM_BOT_TOKEN=123456789:ABC-DEF1234ghIkl-zyx57W2v1u123ew11
CHAT_ID=-1001234567890
OPENAI_API_KEY=sk-your-openai-api-key-here
# Optional: enables dashboard-editable voting message templates
EDGE_CONFIG=https://edge-config.vercel.com/...
# Optional: enables Telegram admin commands for template edits
ADMIN_USER_IDS=123456789,987654321
VERCEL_API_TOKEN=vercel-api-token-with-edge-config-access
# Optional if the ID cannot be derived from EDGE_CONFIG
EDGE_CONFIG_ID=ecfg_...
# Optional for team-scoped Edge Config stores
VERCEL_TEAM_ID=team_...
```

### Editable Voting Message

The daily voting message can be edited without a code deploy by using Vercel Edge Config:

1. Create an Edge Config store in the Vercel dashboard and connect it to this project.
2. Add a string item with key `votingMessageTemplate`.
3. Paste the full Telegram message text as the value.
4. Keep the final line as `Сегодня с нами:` because registrations are appended below it.

If `EDGE_CONFIG` is missing, the key is missing, or the value does not end with `Сегодня с нами:`, the bot uses the bundled template from the repository.

On Vercel Hobby, this is intended to stay within the free allowance for normal daily-poll usage because the cron route reads one Edge Config item per poll.

### Telegram Admin Commands

Set `ADMIN_USER_IDS` to a comma-separated list of Telegram user IDs that are allowed to manage bot settings from the group. If this variable is missing, nobody can run admin commands.

Supported commands:

```text
/template_help
/template_preview
/template_set
<full new voting message>
/template_reset
```

`/template_set` saves the message to Edge Config using the key `votingMessageTemplate`. The final line must be `Сегодня с нами:` so player registrations can be appended below it.

Admin writes require `EDGE_CONFIG` plus a Vercel API token in `VERCEL_API_TOKEN` or `VERCEL_TOKEN`. If `EDGE_CONFIG_ID` is not set, the bot tries to derive it from `EDGE_CONFIG`.

### Development

```bash
npm install
npm run dev
```

The bot webhook will be available at `http://localhost:3000/api/telegram/webhook`

### Checks

```bash
npm run lint
npm test
npm run preview:voting-message
```

`preview:voting-message` prints the template the cron route would use. If `EDGE_CONFIG` is configured locally, it previews the Edge Config value; otherwise it previews the bundled fallback.

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

## AI Integration

The bot uses OpenAI's [GPT-4.1 Nano](https://platform.openai.com/docs/models/gpt-4.1-nano) model for humor generation with the following configuration:

- **Model**: `gpt-4.1-nano-2025-04-14`
- **System Prompt**: "Ты весёлый бот клуба мафии LaFamilia. Отвечай на сообщения короткой шуткой или дружеской подколкой на русском языке."
- **Parameters**:
  - `max_tokens`: 60
  - `temperature`: 0.9

The bot provides contextual responses by including previous message content when users reply to bot messages, enabling more relevant humor generation.
