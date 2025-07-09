// Telegram voting constants
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
    { text: "Не приду", callback_data: "time_not_coming" },
  ],
];

export const VOTING_MESSAGE_TEMPLATE = `Друзья, сегодня мы собираемся на наши вечерние игры мафия! Приглашаем всех желающих принять участие, Локация: Gashisha lounge Время встречи: 20:00. Увидимся вечером 🕵️

Нажмите на кнопку ниже, чтобы зарегистрироваться.

Сегодня с нами:`;

export const CALLBACK_MESSAGES = {
  NOT_COMING: "Жаль, что не сможете прийти!",
  REGISTERED: (time: string) => `Записал на ${time}!`,
} as const;
