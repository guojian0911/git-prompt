import React, { createContext, useContext, useState, useEffect } from "react";
import {
  ModelProvider,
  ProviderConfig,
  ModelInfo,
  STORAGE_KEY,
  DEFAULT_SETTINGS,
  MODEL_PROVIDERS
} from "@/constants/modelProviders";

interface ModelSettings {
  providers: ProviderConfig[];
  defaultProvider: string;
  defaultModel: string;
  defaultTemperature: number;
  defaultMaxTokens: number;
}

interface ModelSettingsContextType {
  settings: ModelSettings;
  providers: ProviderConfig[];
  activeProvider: ProviderConfig | null;
  availableModels: ModelInfo[];
  isLoading: boolean;
  saveProvider: (provider: ProviderConfig) => void;
  removeProvider: (providerId: string) => void;
  setActiveProvider: (providerId: string) => void;
  setDefaultModel: (modelId: string) => void;
  setDefaultSettings: (settings: Partial<ModelSettings>) => void;
  testConnection: (provider: ProviderConfig) => Promise<{success: boolean, models?: ModelInfo[], error?: string}>;
}

const ModelSettingsContext = createContext<ModelSettingsContextType | undefined>(undefined);

export const ModelSettingsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [settings, setSettings] = useState<ModelSettings>(() => {
    const savedSettings = localStorage.getItem(STORAGE_KEY);
    return savedSettings ? JSON.parse(savedSettings) : DEFAULT_SETTINGS;
  });

  const [availableModels, setAvailableModels] = useState<ModelInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 保存设置到本地存储
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [settings]);

  // 获取当前活跃的提供商
  const activeProvider = settings.providers.find(p => p.id === settings.defaultProvider) ||
                         (settings.providers.length > 0 ? settings.providers[0] : null);

  // 保存提供商配置
  const saveProvider = (provider: ProviderConfig) => {
    setSettings(prev => {
      const existingIndex = prev.providers.findIndex(p => p.id === provider.id);
      let newProviders;

      if (existingIndex >= 0) {
        newProviders = [...prev.providers];
        newProviders[existingIndex] = provider;
      } else {
        newProviders = [...prev.providers, provider];
      }

      // 如果是第一个提供商或者设置为活跃，则设为默认
      const newDefaultProvider =
        prev.defaultProvider === "" || provider.isActive ? provider.id : prev.defaultProvider;

      return {
        ...prev,
        providers: newProviders,
        defaultProvider: newDefaultProvider
      };
    });
  };

  // 移除提供商
  const removeProvider = (providerId: string) => {
    setSettings(prev => {
      const newProviders = prev.providers.filter(p => p.id !== providerId);

      // 如果删除的是默认提供商，则重置默认提供商
      let newDefaultProvider = prev.defaultProvider;
      if (providerId === prev.defaultProvider) {
        newDefaultProvider = newProviders.length > 0 ? newProviders[0].id : "";
      }

      return {
        ...prev,
        providers: newProviders,
        defaultProvider: newDefaultProvider
      };
    });
  };

  // 设置活跃提供商
  const setActiveProvider = (providerId: string) => {
    setSettings(prev => ({
      ...prev,
      defaultProvider: providerId
    }));
  };

  // 设置默认模型
  const setDefaultModel = (modelId: string) => {
    setSettings(prev => ({
      ...prev,
      defaultModel: modelId
    }));
  };

  // 设置默认设置
  const setDefaultSettings = (newSettings: Partial<ModelSettings>) => {
    setSettings(prev => ({
      ...prev,
      ...newSettings
    }));
  };

  // 测试连接并获取可用模型
  const testConnection = async (provider: ProviderConfig): Promise<{success: boolean, models?: ModelInfo[], error?: string}> => {
    setIsLoading(true);

    try {
      let models: ModelInfo[] = [];

      // 根据不同的提供商调用不同的API
      switch (provider.id) {
        case "openai":
          models = await fetchOpenAIModels(provider);
          break;
        case "openai_compatible":
          models = await fetchOpenAICompatibleModels(provider);
          break;
        case "anthropic":
          models = await fetchAnthropicModels(provider);
          break;
        case "openrouter":
          models = await fetchOpenRouterModels(provider);
          break;
        case "google":
          models = await fetchGoogleAIModels(provider);
          break;
        default:
          // 对于自定义提供商，使用模拟数据
          models = [
            {
              id: `${provider.id}-model-1`,
              name: `${provider.name} Model 1`,
              provider: provider.id,
              contextWindow: 8192,
              capabilities: ["chat", "completion"]
            },
            {
              id: `${provider.id}-model-2`,
              name: `${provider.name} Model 2`,
              provider: provider.id,
              contextWindow: 16384,
              capabilities: ["chat", "completion", "embeddings"]
            }
          ];
      }

      // 更新可用模型
      setAvailableModels(models);

      // 更新提供商最后测试时间
      saveProvider({
        ...provider,
        lastTested: Date.now()
      });

      setIsLoading(false);
      return { success: true, models };
    } catch (error) {
      setIsLoading(false);
      return {
        success: false,
        error: error instanceof Error ? error.message : "未知错误"
      };
    }
  };

  // 获取OpenAI模型列表
  const fetchOpenAIModels = async (provider: ProviderConfig): Promise<ModelInfo[]> => {
    try {
      const response = await fetch(`${provider.baseUrl}/models`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "获取OpenAI模型列表失败");
      }

      const data = await response.json();

      // 过滤出GPT模型
      const gptModels = data.data.filter((model: any) =>
        (model.id.includes("gpt") || model.id.includes("text-davinci")) &&
        !model.id.includes("instruct")
      );

      // 转换为统一的ModelInfo格式
      return gptModels.map((model: any) => ({
        id: model.id,
        name: model.id,
        provider: provider.id,
        contextWindow: getContextWindowForModel(model.id),
        capabilities: ["chat", "completion"]
      }));
    } catch (error) {
      console.error("获取OpenAI模型列表失败:", error);
      throw error;
    }
  };

  // 获取OpenAI兼容模型列表
  const fetchOpenAICompatibleModels = async (provider: ProviderConfig): Promise<ModelInfo[]> => {
    try {
      // 检查baseUrl是否已设置
      if (!provider.baseUrl) {
        throw new Error("请先设置API Base URL");
      }

      // 尝试获取模型列表
      try {
        const response = await fetch(`${provider.baseUrl}/models`, {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${provider.apiKey}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();

          // 如果API返回了模型列表，使用它
          if (data.data && Array.isArray(data.data)) {
            return data.data.map((model: any) => ({
              id: model.id,
              name: model.id,
              provider: provider.id,
              contextWindow: 4096, // 默认值，可能需要根据实际情况调整
              capabilities: ["chat", "completion"]
            }));
          }
        }
      } catch (error) {
        console.warn("无法获取模型列表，将使用默认模型:", error);
      }

      // 如果无法获取模型列表或格式不符合预期，使用常见的兼容模型列表
      return [
        {
          id: "gpt-3.5-turbo",
          name: "GPT-3.5 Turbo (兼容)",
          provider: provider.id,
          contextWindow: 4096,
          capabilities: ["chat", "completion"]
        },
        {
          id: "gpt-4",
          name: "GPT-4 (兼容)",
          provider: provider.id,
          contextWindow: 8192,
          capabilities: ["chat", "completion"]
        },
        {
          id: "llama-2-7b",
          name: "Llama 2 7B",
          provider: provider.id,
          contextWindow: 4096,
          capabilities: ["chat", "completion"]
        },
        {
          id: "llama-2-13b",
          name: "Llama 2 13B",
          provider: provider.id,
          contextWindow: 4096,
          capabilities: ["chat", "completion"]
        },
        {
          id: "llama-2-70b",
          name: "Llama 2 70B",
          provider: provider.id,
          contextWindow: 4096,
          capabilities: ["chat", "completion"]
        },
        {
          id: "mistral-7b",
          name: "Mistral 7B",
          provider: provider.id,
          contextWindow: 8192,
          capabilities: ["chat", "completion"]
        },
        {
          id: "mixtral-8x7b",
          name: "Mixtral 8x7B",
          provider: provider.id,
          contextWindow: 32768,
          capabilities: ["chat", "completion"]
        }
      ];
    } catch (error) {
      console.error("获取OpenAI兼容模型列表失败:", error);
      throw error;
    }
  };

  // 获取Anthropic模型列表
  const fetchAnthropicModels = async (provider: ProviderConfig): Promise<ModelInfo[]> => {
    // Anthropic没有提供获取模型列表的API，使用硬编码的模型列表
    return [
      {
        id: "claude-3-opus-20240229",
        name: "Claude 3 Opus",
        provider: provider.id,
        contextWindow: 200000,
        capabilities: ["chat"]
      },
      {
        id: "claude-3-sonnet-20240229",
        name: "Claude 3 Sonnet",
        provider: provider.id,
        contextWindow: 180000,
        capabilities: ["chat"]
      },
      {
        id: "claude-3-haiku-20240307",
        name: "Claude 3 Haiku",
        provider: provider.id,
        contextWindow: 150000,
        capabilities: ["chat"]
      },
      {
        id: "claude-2.1",
        name: "Claude 2.1",
        provider: provider.id,
        contextWindow: 100000,
        capabilities: ["chat"]
      },
      {
        id: "claude-2.0",
        name: "Claude 2.0",
        provider: provider.id,
        contextWindow: 100000,
        capabilities: ["chat"]
      },
      {
        id: "claude-instant-1.2",
        name: "Claude Instant 1.2",
        provider: provider.id,
        contextWindow: 100000,
        capabilities: ["chat"]
      }
    ];
  };

  // 获取OpenRouter模型列表
  const fetchOpenRouterModels = async (provider: ProviderConfig): Promise<ModelInfo[]> => {
    try {
      const response = await fetch(`${provider.baseUrl}/models`, {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${provider.apiKey}`,
          "Content-Type": "application/json"
        }
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || "获取OpenRouter模型列表失败");
      }

      const data = await response.json();

      // 转换为统一的ModelInfo格式
      return data.data.map((model: any) => ({
        id: model.id,
        name: model.name || model.id,
        provider: provider.id,
        contextWindow: model.context_length || 4096,
        capabilities: ["chat", "completion"]
      }));
    } catch (error) {
      console.error("获取OpenRouter模型列表失败:", error);
      throw error;
    }
  };

  // 获取Google AI模型列表
  const fetchGoogleAIModels = async (provider: ProviderConfig): Promise<ModelInfo[]> => {
    // Google AI没有提供获取模型列表的公开API，使用硬编码的模型列表
    return [
      {
        id: "gemini-pro",
        name: "Gemini Pro",
        provider: provider.id,
        contextWindow: 32768,
        capabilities: ["chat", "completion"]
      },
      {
        id: "gemini-ultra",
        name: "Gemini Ultra",
        provider: provider.id,
        contextWindow: 32768,
        capabilities: ["chat", "completion"]
      },
      {
        id: "gemini-flash",
        name: "Gemini Flash",
        provider: provider.id,
        contextWindow: 16384,
        capabilities: ["chat", "completion"]
      }
    ];
  };

  // 根据模型ID获取上下文窗口大小
  const getContextWindowForModel = (modelId: string): number => {
    if (modelId.includes("gpt-4-turbo")) return 128000;
    if (modelId.includes("gpt-4-32k")) return 32768;
    if (modelId.includes("gpt-4")) return 8192;
    if (modelId.includes("gpt-3.5-turbo-16k")) return 16384;
    if (modelId.includes("gpt-3.5-turbo")) return 4096;
    if (modelId.includes("text-davinci")) return 4096;
    return 4096; // 默认值
  };

  const value = {
    settings,
    providers: settings.providers,
    activeProvider,
    availableModels,
    isLoading,
    saveProvider,
    removeProvider,
    setActiveProvider,
    setDefaultModel,
    setDefaultSettings,
    testConnection
  };

  return (
    <ModelSettingsContext.Provider value={value}>
      {children}
    </ModelSettingsContext.Provider>
  );
};

export const useModelSettings = () => {
  const context = useContext(ModelSettingsContext);
  if (context === undefined) {
    throw new Error("useModelSettings must be used within a ModelSettingsProvider");
  }
  return context;
};
