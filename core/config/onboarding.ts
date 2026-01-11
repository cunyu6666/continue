import { ConfigYaml } from "@continuedev/config-yaml";

// Qoder Chat 默认配置
export const QODER_SYSTEM_PROMPT =
  "你是 Qoder Chat，一个专业的 AI 编程助手，由 Qoder IDE 提供支持。你的目标是帮助开发者高效地编写、调试和优化代码。请始终以专业、友好的态度回应，并提供准确、有用的信息。";
export const QODER_API_BASE = "https://api.xiaomimimo.com/v1";
export const QODER_API_KEY =
  "sk-ccnuogkdlp60pvrerpcfq9xqbkbxw8o9lbi0yyf07tpuwnrr";
export const QODER_MODEL = "mimo-v2-flash";
export const QODER_MODEL_TITLE = "Mimo v2 Flash";

export const LOCAL_ONBOARDING_PROVIDER_TITLE = "Mimo";
export const LOCAL_ONBOARDING_FIM_MODEL = QODER_MODEL;
export const LOCAL_ONBOARDING_FIM_TITLE = QODER_MODEL_TITLE;
export const LOCAL_ONBOARDING_CHAT_MODEL = QODER_MODEL;
export const LOCAL_ONBOARDING_CHAT_TITLE = QODER_MODEL_TITLE;
export const LOCAL_ONBOARDING_EMBEDDINGS_MODEL = "nomic-embed-text:latest";
export const LOCAL_ONBOARDING_EMBEDDINGS_TITLE = "Nomic Embed";

const ANTHROPIC_MODEL_CONFIG = {
  slugs: ["anthropic/claude-3-7-sonnet", "anthropic/claude-4-sonnet"],
  apiKeyInputName: "ANTHROPIC_API_KEY",
};
const OPENAI_MODEL_CONFIG = {
  slugs: ["openai/gpt-4.1", "openai/o3", "openai/gpt-4.1-mini"],
  apiKeyInputName: "OPENAI_API_KEY",
};

// TODO: These need updating on the hub
const GEMINI_MODEL_CONFIG = {
  slugs: ["google/gemini-2.5-pro", "google/gemini-2.0-flash"],
  apiKeyInputName: "GEMINI_API_KEY",
};

/**
 * Qoder Chat 默认配置 - 使用 Mimo API
 */
export function setupBestConfig(config: ConfigYaml): ConfigYaml {
  return {
    ...config,
    models: [
      {
        name: QODER_MODEL_TITLE,
        provider: "openai",
        model: QODER_MODEL,
        apiBase: QODER_API_BASE,
        apiKey: QODER_API_KEY,
        systemMessage: QODER_SYSTEM_PROMPT,
        roles: ["chat", "edit", "apply"],
      },
      ...(config.models ?? []),
    ],
  };
}

export function setupLocalConfig(config: ConfigYaml): ConfigYaml {
  return {
    ...config,
    models: [
      {
        name: QODER_MODEL_TITLE,
        provider: "openai",
        model: QODER_MODEL,
        apiBase: QODER_API_BASE,
        apiKey: QODER_API_KEY,
        systemMessage: QODER_SYSTEM_PROMPT,
        roles: ["chat", "edit", "apply", "autocomplete"],
      },
      {
        name: LOCAL_ONBOARDING_EMBEDDINGS_TITLE,
        provider: "ollama",
        model: LOCAL_ONBOARDING_EMBEDDINGS_MODEL,
        roles: ["embed"],
      },
      ...(config.models ?? []),
    ],
  };
}

export function setupQuickstartConfig(config: ConfigYaml): ConfigYaml {
  return config;
}

export function setupProviderConfig(
  config: ConfigYaml,
  provider: string,
  apiKey: string,
): ConfigYaml {
  let newModels;

  switch (provider) {
    case "openai":
      newModels = OPENAI_MODEL_CONFIG.slugs.map((slug) => ({
        uses: slug,
        with: {
          [OPENAI_MODEL_CONFIG.apiKeyInputName]: apiKey,
        },
      }));
      break;
    case "anthropic":
      newModels = ANTHROPIC_MODEL_CONFIG.slugs.map((slug) => ({
        uses: slug,
        with: {
          [ANTHROPIC_MODEL_CONFIG.apiKeyInputName]: apiKey,
        },
      }));
      break;
    case "gemini":
      newModels = GEMINI_MODEL_CONFIG.slugs.map((slug) => ({
        uses: slug,
        with: {
          [GEMINI_MODEL_CONFIG.apiKeyInputName]: apiKey,
        },
      }));
      break;
    default:
      throw new Error(`Unknown provider: ${provider}`);
  }

  return {
    ...config,
    models: [...(config.models ?? []), ...newModels],
  };
}
