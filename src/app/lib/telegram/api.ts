// Telegram API utilities

export interface TelegramResponse {
  ok: boolean;
  result?: any;
  error_code?: number;
  description?: string;
}

export interface SendMessageParams {
  chat_id: string | number;
  text: string;
  reply_markup?: {
    inline_keyboard: Array<Array<{ text: string; callback_data: string }>>;
  };
}

export interface EditMessageParams {
  chat_id: string | number;
  message_id: number;
  text: string;
  reply_markup?: {
    inline_keyboard: Array<Array<{ text: string; callback_data: string }>>;
  };
}

export interface AnswerCallbackQueryParams {
  callback_query_id: string;
  text?: string;
}

export class TelegramAPI {
  private static get botToken(): string {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN environment variable is required");
    }
    return token;
  }

  private static get baseUrl(): string {
    return `https://api.telegram.org/bot${this.botToken}`;
  }

  static async sendMessage(
    params: SendMessageParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  static async editMessageText(
    params: EditMessageParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/editMessageText`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }

  static async answerCallbackQuery(
    params: AnswerCallbackQueryParams
  ): Promise<TelegramResponse> {
    const response = await fetch(`${this.baseUrl}/answerCallbackQuery`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(params),
    });

    return response.json();
  }
}
