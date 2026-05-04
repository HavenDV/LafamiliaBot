import { get } from "@vercel/edge-config";

import {
  REGISTRATION_SECTION_HEADER,
  VOTING_MESSAGE_TEMPLATE,
} from "./constants";

const VERCEL_API_URL = "https://api.vercel.com";

export const MAX_VOTING_MESSAGE_TEMPLATE_LENGTH = 3000;
export const VOTING_MESSAGE_TEMPLATE_EDGE_CONFIG_KEY = "votingMessageTemplate";

export function getVotingMessageTemplateValidationError(
  value: unknown
): string | null {
  if (typeof value !== "string" || value.trim().length === 0) {
    return "Шаблон должен быть непустой строкой.";
  }

  if (value.length > MAX_VOTING_MESSAGE_TEMPLATE_LENGTH) {
    return `Шаблон должен быть не длиннее ${MAX_VOTING_MESSAGE_TEMPLATE_LENGTH} символов.`;
  }

  if (!value.trimEnd().endsWith(REGISTRATION_SECTION_HEADER)) {
    return `Шаблон должен заканчиваться строкой "${REGISTRATION_SECTION_HEADER}".`;
  }

  return null;
}

export function isValidVotingMessageTemplate(value: unknown): value is string {
  return getVotingMessageTemplateValidationError(value) === null;
}

export async function getVotingMessageTemplate(): Promise<string> {
  if (!process.env.EDGE_CONFIG) {
    return VOTING_MESSAGE_TEMPLATE;
  }

  try {
    const configuredTemplate = await get<unknown>(
      VOTING_MESSAGE_TEMPLATE_EDGE_CONFIG_KEY
    );

    if (isValidVotingMessageTemplate(configuredTemplate)) {
      return configuredTemplate;
    }

    if (configuredTemplate !== undefined) {
      console.warn(
        `Ignoring invalid Edge Config value for ${VOTING_MESSAGE_TEMPLATE_EDGE_CONFIG_KEY}`
      );
    }
  } catch (error) {
    console.error("Failed to load voting message template from Edge Config:", error);
  }

  return VOTING_MESSAGE_TEMPLATE;
}

export function getConfiguredEdgeConfigId(): string | null {
  const configuredId = process.env.EDGE_CONFIG_ID?.trim();
  if (configuredId) {
    return configuredId;
  }

  const connectionString = process.env.EDGE_CONFIG;
  if (!connectionString) {
    return null;
  }

  try {
    const url = new URL(connectionString);
    const edgeConfigId = url.pathname.split("/").filter(Boolean)[0];
    return edgeConfigId || null;
  } catch {
    return null;
  }
}

function getVercelApiToken(): string | null {
  return (
    process.env.VERCEL_API_TOKEN?.trim() || process.env.VERCEL_TOKEN?.trim() || null
  );
}

function buildEdgeConfigItemsUrl(edgeConfigId: string): string {
  const url = new URL(`/v1/edge-config/${edgeConfigId}/items`, VERCEL_API_URL);
  const teamId = process.env.VERCEL_TEAM_ID?.trim();
  const teamSlug = process.env.VERCEL_TEAM_SLUG?.trim();

  if (teamId) {
    url.searchParams.set("teamId", teamId);
  } else if (teamSlug) {
    url.searchParams.set("slug", teamSlug);
  }

  return url.toString();
}

async function patchVotingMessageTemplate(template: string): Promise<void> {
  const validationError = getVotingMessageTemplateValidationError(template);
  if (validationError) {
    throw new Error(validationError);
  }

  const token = getVercelApiToken();
  if (!token) {
    throw new Error("VERCEL_API_TOKEN or VERCEL_TOKEN is required.");
  }

  if (!process.env.EDGE_CONFIG?.trim()) {
    throw new Error("EDGE_CONFIG is required.");
  }

  const edgeConfigId = getConfiguredEdgeConfigId();
  if (!edgeConfigId) {
    throw new Error("EDGE_CONFIG_ID or EDGE_CONFIG is required.");
  }

  const response = await fetch(buildEdgeConfigItemsUrl(edgeConfigId), {
    method: "PATCH",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      items: [
        {
          operation: "upsert",
          key: VOTING_MESSAGE_TEMPLATE_EDGE_CONFIG_KEY,
          value: template,
        },
      ],
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(
      `Failed to update Edge Config (${response.status}): ${errorBody}`
    );
  }
}

export async function updateVotingMessageTemplate(
  template: string
): Promise<void> {
  await patchVotingMessageTemplate(template);
}

export async function resetVotingMessageTemplate(): Promise<void> {
  await patchVotingMessageTemplate(VOTING_MESSAGE_TEMPLATE);
}
