import assert from "node:assert/strict";
import { describe, it } from "node:test";

import { REGISTRATION_SECTION_HEADER } from "./constants";
import {
  getVotingAdminHelpMessage,
  isVotingAdmin,
  parseAdminUserIds,
  parseVotingAdminCommand,
} from "./admin";

describe("voting admin commands", () => {
  it("parses comma-separated admin user IDs", () => {
    assert.deepEqual(Array.from(parseAdminUserIds("123, 456, nope")), [123, 456]);
  });

  it("authorizes only configured admin user IDs", () => {
    const adminIds = parseAdminUserIds("123,456");

    assert.equal(isVotingAdmin(123, adminIds), true);
    assert.equal(isVotingAdmin(789, adminIds), false);
    assert.equal(isVotingAdmin(undefined, adminIds), false);
  });

  it("parses template commands with bot usernames", () => {
    assert.deepEqual(parseVotingAdminCommand("/template_preview@lafamilias_bot"), {
      name: "preview",
      template: "",
    });
  });

  it("parses multiline template updates", () => {
    const template = `Новый шаблон

${REGISTRATION_SECTION_HEADER}`;

    assert.deepEqual(parseVotingAdminCommand(`/template_set\n${template}`), {
      name: "set",
      template,
    });
  });

  it("ignores non-admin commands", () => {
    assert.equal(parseVotingAdminCommand("/start"), null);
    assert.equal(parseVotingAdminCommand("hello /template_preview"), null);
  });

  it("documents the required registration header", () => {
    assert.match(getVotingAdminHelpMessage(), /\/template_set/);
    assert.match(getVotingAdminHelpMessage(), new RegExp(REGISTRATION_SECTION_HEADER));
  });
});
