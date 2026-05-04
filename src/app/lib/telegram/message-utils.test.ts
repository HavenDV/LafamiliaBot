import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  REGISTRATION_SECTION_HEADER,
  VOTING_MESSAGE_TEMPLATE,
} from "./constants";
import { MessageUtils } from "./message-utils";

describe("MessageUtils", () => {
  it("appends a user registration below the shared registration header", () => {
    const updatedMessage = MessageUtils.updateMessageWithUserSelection(
      VOTING_MESSAGE_TEMPLATE,
      "@alice",
      "20:30"
    );

    assert.equal(
      updatedMessage,
      `${VOTING_MESSAGE_TEMPLATE}\n\n1. 👤 @alice (Время: 20:30)`
    );
  });

  it("updates an existing registration for the same normalized user", () => {
    const initialMessage = MessageUtils.updateMessageWithUserSelection(
      VOTING_MESSAGE_TEMPLATE,
      "@alice",
      "20:30"
    );

    const updatedMessage = MessageUtils.updateMessageWithUserSelection(
      initialMessage,
      "@Alice",
      "21:00"
    );

    assert.equal(
      updatedMessage,
      `${VOTING_MESSAGE_TEMPLATE}\n\n1. 👤 @Alice (Время: 21:00)`
    );
  });

  it("removes an existing registration when user selects not coming", () => {
    const initialMessage = MessageUtils.updateMessageWithUserSelection(
      VOTING_MESSAGE_TEMPLATE,
      "@alice",
      "20:30"
    );

    const updatedMessage = MessageUtils.updateMessageWithUserSelection(
      initialMessage,
      "@alice",
      "not_coming"
    );

    assert.equal(updatedMessage, VOTING_MESSAGE_TEMPLATE);
  });

  it("returns parsed users from the registrations section", () => {
    const message = `${VOTING_MESSAGE_TEMPLATE}

1. 👤 @alice (Время: 20:30)
2. 👤 Bob Smith (Время: 21:00)`;

    assert.deepEqual(MessageUtils.getRegisteredUsers(message), [
      { userName: "@alice", selectedTime: "20:30" },
      { userName: "Bob Smith", selectedTime: "21:00" },
    ]);
  });

  it("keeps the current template compatible with the shared registration header", () => {
    assert.ok(VOTING_MESSAGE_TEMPLATE.endsWith(REGISTRATION_SECTION_HEADER));
  });
});
