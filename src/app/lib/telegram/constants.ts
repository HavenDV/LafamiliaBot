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
    { text: "22:30", callback_data: "time_22:30" },
    { text: "23:00", callback_data: "time_23:00" },
  ],
  [
    { text: "23:00", callback_data: "time_23:00" },
    { text: "23:30", callback_data: "time_23:30" },
    { text: "00:00", callback_data: "time_00:00" },
  ],
  [
    { text: "00:30", callback_data: "time_00:30" },
    { text: "01:00", callback_data: "time_01:00" },
    { text: "Не приду", callback_data: "time_not_coming" },
  ],
];

export const VOTING_MESSAGE_TEMPLATE = `Друзья, всех приветствую!

Сегодня вечером мы собираемся на наши вечерние игры мафия!

Приглашаем абсолютно всех желающих провести вечер вместе с нами!

Если вы ранее не играли, мы вас научим!

Время сбора в 19:00 до 01:00
Место встречи: Gashisha lounge 
Valet parking 🅿️ 

Для участия нужно будет нажать на время в котором вы будете уже на месте!

Сегодня с нами:`;

export const CALLBACK_MESSAGES = {
  NOT_COMING: "Жаль, что не сможете прийти!",
  REGISTERED: (time: string) => `Записал на ${time}!`,
} as const;
