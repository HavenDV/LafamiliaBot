// Telegram voting constants
export const REGISTRATION_SECTION_HEADER = "Сегодня с нами:";

export const TIME_BUTTONS = [
  [
    { text: "19:00", callback_data: "time_19:00" },
    { text: "19:30", callback_data: "time_19:30" },
    { text: "20:00", callback_data: "time_20:00" },
  ],
  [
    { text: "20:30", callback_data: "time_20:30" },
    { text: "21:00", callback_data: "time_21:00" },
    { text: "21:30", callback_data: "time_21:30" },
  ],
  [
    { text: "22:00", callback_data: "time_22:00" },
    { text: "22:30", callback_data: "time_22:30" },
    { text: "23:00", callback_data: "time_23:00" },
  ],
  [{ text: "Не приду", callback_data: "time_not_coming" }],
];

export const VOTING_MESSAGE_TEMPLATE = `🎭 Вечерняя Мафия 🎭

Друзья, всех приветствую! 🎉

Сегодня вечером собираемся на наши игры в мафию и будем рады видеть каждого! 🕵️‍♂️🕵️‍♀️

Если вы новичок — не переживайте, всему научим! 😉

🕰️ Время: с 19:00 до 02:00
📍 Место: Vesna lounge
🅿️ Valet parking

Для участия нажмите на удобное вам время ниже ⏰

${REGISTRATION_SECTION_HEADER}`;

export const CALLBACK_MESSAGES = {
  NOT_COMING: "Жаль, что не сможете прийти!",
  REGISTERED: (time: string) => `Записал на ${time}!`,
} as const;
