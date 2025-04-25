import { LucideIcon, Cpu, MessageSquare, Bot, Layers, Boxes, Network } from "lucide-react";

// 模型提供商类型
export interface ModelProvider {
  id: string;
  name: string;
  icon: LucideIcon;
  defaultBaseUrl: string;
  description: string;
}

// 模型信息类型
export interface ModelInfo {
  id: string;
  name: string;
  provider: string;
  contextWindow?: number;
  capabilities?: string[];
  description?: string;
}

// 提供商配置类型
export interface ProviderConfig {
  id: string;
  name: string;
  apiKey: string;
  baseUrl: string;
  isActive: boolean;
  lastTested?: number;
  customSettings?: Record<string, any>;
}

// 支持的模型提供商列表
export const MODEL_PROVIDERS: ModelProvider[] = [
  {
    id: "openai",
    name: "OpenAI",
    icon: MessageSquare,
    defaultBaseUrl: "https://api.openai.com/v1",
    description: "OpenAI API提供对GPT-4、GPT-3.5等模型的访问"
  },
  {
    id: "openai_compatible",
    name: "OpenAI Compatible",
    icon: MessageSquare,
    defaultBaseUrl: "",
    description: "兼容OpenAI API的服务，如开源模型部署或私有部署"
  },
  {
    id: "anthropic",
    name: "Anthropic",
    icon: Bot,
    defaultBaseUrl: "https://api.anthropic.com/v1",
    description: "Anthropic的Claude系列模型"
  },
  {
    id: "openrouter",
    name: "OpenRouter",
    icon: Network,
    defaultBaseUrl: "https://openrouter.ai/api/v1",
    description: "统一API访问多种AI模型"
  },
  {
    id: "google",
    name: "Google AI",
    icon: Layers,
    defaultBaseUrl: "https://generativelanguage.googleapis.com/v1",
    description: "Google的Gemini系列模型"
  },
  {
    id: "custom",
    name: "自定义",
    icon: Boxes,
    defaultBaseUrl: "",
    description: "配置自定义AI提供商"
  }
];

// 本地存储键
export const STORAGE_KEY = "gitprompt_model_settings";

// 默认设置
export const DEFAULT_SETTINGS = {
  providers: [],
  defaultProvider: "",
  defaultModel: "",
  defaultTemperature: 0.7,
  defaultMaxTokens: 1000
};
