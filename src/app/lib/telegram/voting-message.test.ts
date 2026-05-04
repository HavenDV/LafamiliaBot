import assert from "node:assert/strict";
import { describe, it } from "node:test";

import {
  REGISTRATION_SECTION_HEADER,
  VOTING_MESSAGE_TEMPLATE,
} from "./constants";
import {
  getVotingMessageTemplate,
  getConfiguredEdgeConfigId,
  getVotingMessageTemplateValidationError,
  isValidVotingMessageTemplate,
  MAX_VOTING_MESSAGE_TEMPLATE_LENGTH,
  VOTING_MESSAGE_TEMPLATE_EDGE_CONFIG_KEY,
} from "./voting-message";

describe("voting message template", () => {
  it("uses a stable Edge Config key", () => {
    assert.equal(
      VOTING_MESSAGE_TEMPLATE_EDGE_CONFIG_KEY,
      "votingMessageTemplate"
    );
  });

  it("accepts non-empty templates that end with the registration header", () => {
    assert.equal(isValidVotingMessageTemplate(VOTING_MESSAGE_TEMPLATE), true);
  });

  it("rejects templates that would break registration parsing", () => {
    assert.equal(isValidVotingMessageTemplate("no registration section"), false);
    assert.equal(
      isValidVotingMessageTemplate(`${REGISTRATION_SECTION_HEADER}\nextra line`),
      false
    );
    assert.equal(isValidVotingMessageTemplate(""), false);
    assert.equal(isValidVotingMessageTemplate(null), false);
  });

  it("reports why invalid templates cannot be saved", () => {
    assert.equal(
      getVotingMessageTemplateValidationError("missing header"),
      `Шаблон должен заканчиваться строкой "${REGISTRATION_SECTION_HEADER}".`
    );
    assert.equal(
      getVotingMessageTemplateValidationError(
        `${"x".repeat(MAX_VOTING_MESSAGE_TEMPLATE_LENGTH)}${
          REGISTRATION_SECTION_HEADER
        }`
      ),
      `Шаблон должен быть не длиннее ${MAX_VOTING_MESSAGE_TEMPLATE_LENGTH} символов.`
    );
  });

  it("falls back to the bundled template when Edge Config is not configured", async () => {
    const previousEdgeConfig = process.env.EDGE_CONFIG;
    delete process.env.EDGE_CONFIG;

    try {
      assert.equal(await getVotingMessageTemplate(), VOTING_MESSAGE_TEMPLATE);
    } finally {
      if (previousEdgeConfig === undefined) {
        delete process.env.EDGE_CONFIG;
      } else {
        process.env.EDGE_CONFIG = previousEdgeConfig;
      }
    }
  });

  it("keeps the bundled template ending on the registration header", () => {
    assert.equal(
      VOTING_MESSAGE_TEMPLATE.endsWith(REGISTRATION_SECTION_HEADER),
      true
    );
  });

  it("can derive the Edge Config ID from the connection string", () => {
    const previousEdgeConfigId = process.env.EDGE_CONFIG_ID;
    const previousEdgeConfig = process.env.EDGE_CONFIG;
    delete process.env.EDGE_CONFIG_ID;
    process.env.EDGE_CONFIG = "https://edge-config.vercel.com/ecfg_123?token=abc";

    try {
      assert.equal(getConfiguredEdgeConfigId(), "ecfg_123");
    } finally {
      if (previousEdgeConfigId === undefined) {
        delete process.env.EDGE_CONFIG_ID;
      } else {
        process.env.EDGE_CONFIG_ID = previousEdgeConfigId;
      }

      if (previousEdgeConfig === undefined) {
        delete process.env.EDGE_CONFIG;
      } else {
        process.env.EDGE_CONFIG = previousEdgeConfig;
      }
    }
  });
});
