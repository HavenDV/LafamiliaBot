// Message formatting utilities

export interface UserRegistration {
  userName: string;
  selectedTime: string;
}

export class MessageUtils {
  /**
   * Updates a voting message by adding or updating user registrations
   */
  static updateMessageWithUserSelection(
    currentText: string,
    userName: string,
    selectedTime: string
  ): string {
    // Split the message into parts
    const lines = currentText.split("\n");
    const baseMessageEndIndex = lines.findIndex((line) =>
      line.includes("Сегодня с нами:")
    );

    if (baseMessageEndIndex === -1) {
      return currentText; // Fallback if message format is unexpected
    }

    // Get the base message part
    const baseMessage = lines.slice(0, baseMessageEndIndex + 1).join("\n");

    // Parse existing registrations
    const registrations = this.parseExistingRegistrations(
      lines,
      baseMessageEndIndex
    );

    // Update or add user registration
    if (selectedTime === "not_coming") {
      registrations.delete(userName);
    } else {
      registrations.set(userName, selectedTime);
    }

    // Build the updated message
    return this.buildUpdatedMessage(baseMessage, registrations);
  }

  /**
   * Parses existing user registrations from message lines
   */
  private static parseExistingRegistrations(
    lines: string[],
    baseMessageEndIndex: number
  ): Map<string, string> {
    const registrations = new Map<string, string>();
    const existingLines = lines.slice(baseMessageEndIndex + 1);

    // Parse existing registrations
    for (const line of existingLines) {
      if (line.trim()) {
        // Match patterns like "TERMINATOR T4 (Время: 20:30)"
        const timeMatch = line.match(/^(?:👤\s*)?(.+?)\s*\(Время:\s*(.+?)\)$/);
        if (timeMatch) {
          const [, name, time] = timeMatch;
          registrations.set(name.trim(), time.trim());
        }
      }
    }

    return registrations;
  }

  /**
   * Builds the updated message with user registrations
   */
  private static buildUpdatedMessage(
    baseMessage: string,
    registrations: Map<string, string>
  ): string {
    let updatedMessage = baseMessage;

    if (registrations.size > 0) {
      updatedMessage += "\n";
      for (const [name, time] of registrations.entries()) {
        updatedMessage += `\n👤 ${name} (Время: ${time})`;
      }
    }

    return updatedMessage;
  }

  /**
   * Gets all registered users from a message
   */
  static getRegisteredUsers(messageText: string): UserRegistration[] {
    const lines = messageText.split("\n");
    const baseMessageEndIndex = lines.findIndex((line) =>
      line.includes("Сегодня с нами:")
    );

    if (baseMessageEndIndex === -1) {
      return [];
    }

    const registrations = this.parseExistingRegistrations(
      lines,
      baseMessageEndIndex
    );

    return Array.from(registrations.entries()).map(
      ([userName, selectedTime]) => ({
        userName,
        selectedTime,
      })
    );
  }

  /**
   * Gets the current time string in Moscow timezone
   */
  static getCurrentMoscowTime(): string {
    const now = new Date();
    return now.toLocaleTimeString("ru-RU", {
      timeZone: "Europe/Moscow",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}
