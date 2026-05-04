import { REGISTRATION_SECTION_HEADER } from "./constants";
import {
  getVotingMessageTemplate,
  getVotingMessageTemplateValidationError,
  resetVotingMessageTemplate,
  updateVotingMessageTemplate,
} from "./voting-message";

export type VotingAdminCommandName = "help" | "preview" | "set" | "reset";

export interface VotingAdminCommand {
  name: VotingAdminCommandName;
  template?: string;
}

const COMMAND_ALIASES: Record<string, VotingAdminCommandName> = {
  admin: "help",
  admin_help: "help",
  template: "help",
  template_help: "help",
  template_preview: "preview",
  preview_template: "preview",
  template_set: "set",
  set_template: "set",
  template_reset: "reset",
  reset_template: "reset",
};

export function parseAdminUserIds(value = process.env.ADMIN_USER_IDS): Set<number> {
  return new Set(
    (value ?? "")
      .split(",")
      .map((part) => Number(part.trim()))
      .filter((id) => Number.isSafeInteger(id) && id > 0)
  );
}

export function isVotingAdmin(
  userId: number | undefined,
  adminIds = parseAdminUserIds()
): boolean {
  return userId !== undefined && adminIds.has(userId);
}

export function parseVotingAdminCommand(text?: string): VotingAdminCommand | null {
  if (!text) {
    return null;
  }

  const trimmedText = text.trimStart();
  const match = trimmedText.match(/^\/([A-Za-z_]+)(?:@[A-Za-z0-9_]+)?(?=$|\s)/);
  if (!match) {
    return null;
  }

  const commandName = COMMAND_ALIASES[match[1].toLowerCase()];
  if (!commandName) {
    return null;
  }

  return {
    name: commandName,
    template: trimmedText.slice(match[0].length).trimStart(),
  };
}

export function getVotingAdminHelpMessage(): string {
  return `Админ-команды:
/template_preview - показать текущий шаблон
/template_set
<новый текст> - сохранить новый шаблон
/template_reset - вернуть шаблон из кода
/template_help - показать эту подсказку

Шаблон должен заканчиваться строкой:
${REGISTRATION_SECTION_HEADER}`;
}

export async function executeVotingAdminCommand(
  command: VotingAdminCommand,
  userId: number | undefined
): Promise<string> {
  if (!isVotingAdmin(userId)) {
    return "У вас нет доступа к админ-командам.";
  }

  if (command.name === "help") {
    return getVotingAdminHelpMessage();
  }

  if (command.name === "preview") {
    return `Текущий шаблон:\n\n${await getVotingMessageTemplate()}`;
  }

  if (command.name === "reset") {
    await resetVotingMessageTemplate();
    return "Шаблон сброшен к версии из кода. Обновление Edge Config может применяться до 10 секунд.";
  }

  if (!command.template) {
    return `Отправьте новый шаблон после команды /template_set. Последняя строка должна быть:\n${REGISTRATION_SECTION_HEADER}`;
  }

  const validationError = getVotingMessageTemplateValidationError(command.template);
  if (validationError) {
    return `Шаблон не сохранен: ${validationError}`;
  }

  await updateVotingMessageTemplate(command.template);
  return "Шаблон сохранен. Обновление Edge Config может применяться до 10 секунд.";
}
