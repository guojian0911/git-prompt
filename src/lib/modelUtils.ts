import { ProviderConfig } from "@/constants/modelProviders";

// 变量正则表达式，匹配{{variable_name}}格式
const VARIABLE_REGEX = /\{\{([^}]+)\}\}/g;

// 提取提示词中的变量
export function extractVariables(prompt: string): string[] {
  const variables: string[] = [];
  let match;

  while ((match = VARIABLE_REGEX.exec(prompt)) !== null) {
    if (!variables.includes(match[1])) {
      variables.push(match[1]);
    }
  }

  return variables;
}

// 替换提示词中的变量
export function replaceVariables(prompt: string, variables: Record<string, string>): string {
  return prompt.replace(VARIABLE_REGEX, (match, variableName) => {
    return variables[variableName] !== undefined ? variables[variableName] : match;
  });
}

// 高亮显示提示词中的变量
export function highlightVariables(prompt: string): string {
  return prompt.replace(VARIABLE_REGEX, (match) => {
    return `<span class="bg-yellow-100 dark:bg-yellow-900 px-1 rounded">${match}</span>`;
  });
}

// 模型调用参数接口
export interface ModelCallParams {
  provider: ProviderConfig;
  model: string;
  prompt: string;
  variables?: Record<string, string>;
  temperature?: number;
  maxTokens?: number;
  options?: Record<string, any>;
}

// 模型调用响应接口
export interface ModelCallResponse {
  success: boolean;
  content?: string;
  error?: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

// 调用模型API
export async function callModel({
  provider,
  model,
  prompt,
  variables = {},
  temperature = 0.7,
  maxTokens = 1000,
  options = {}
}: ModelCallParams): Promise<ModelCallResponse> {
  try {
    // 替换提示词中的变量
    const processedPrompt = replaceVariables(prompt, variables);

    // 根据不同的提供商实现不同的API调用逻辑
    switch (provider.id) {
      case "openai":
        return await callOpenAI(provider, model, processedPrompt, temperature, maxTokens, options);
      case "openai_compatible":
        return await callOpenAICompatible(provider, model, processedPrompt, temperature, maxTokens, options);
      case "anthropic":
        return await callAnthropic(provider, model, processedPrompt, temperature, maxTokens, options);
      case "openrouter":
        return await callOpenRouter(provider, model, processedPrompt, temperature, maxTokens, options);
      case "google":
        return await callGoogleAI(provider, model, processedPrompt, temperature, maxTokens, options);
      default:
        return await callCustomProvider(provider, model, processedPrompt, temperature, maxTokens, options);
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "未知错误"
    };
  }
}

// OpenAI API调用
async function callOpenAI(
  provider: ProviderConfig,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  options: Record<string, any>
): Promise<ModelCallResponse> {
  try {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens,
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenAI API调用失败");
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0]?.message?.content || "",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "OpenAI API调用失败"
    };
  }
}

// OpenAI兼容API调用
async function callOpenAICompatible(
  provider: ProviderConfig,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  options: Record<string, any>
): Promise<ModelCallResponse> {
  try {
    // 检查baseUrl是否已设置
    if (!provider.baseUrl) {
      throw new Error("请先设置API Base URL");
    }

    // 构建API URL，确保以/结尾
    const baseUrl = provider.baseUrl.endsWith("/")
      ? provider.baseUrl
      : `${provider.baseUrl}/`;

    // 尝试使用chat/completions端点
    try {
      const response = await fetch(`${baseUrl}chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: prompt }],
          temperature,
          max_tokens: maxTokens,
          ...options
        })
      });

      if (response.ok) {
        const data = await response.json();

        return {
          success: true,
          content: data.choices[0]?.message?.content || "",
          usage: {
            promptTokens: data.usage?.prompt_tokens || 0,
            completionTokens: data.usage?.completion_tokens || 0,
            totalTokens: data.usage?.total_tokens || 0
          }
        };
      }
    } catch (error) {
      console.warn("chat/completions端点调用失败，尝试使用completions端点:", error);
    }

    // 如果chat/completions失败，尝试使用completions端点
    try {
      const response = await fetch(`${baseUrl}completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${provider.apiKey}`
        },
        body: JSON.stringify({
          model,
          prompt,
          temperature,
          max_tokens: maxTokens,
          ...options
        })
      });

      if (response.ok) {
        const data = await response.json();

        return {
          success: true,
          content: data.choices[0]?.text || "",
          usage: {
            promptTokens: data.usage?.prompt_tokens || 0,
            completionTokens: data.usage?.completion_tokens || 0,
            totalTokens: data.usage?.total_tokens || 0
          }
        };
      } else {
        const error = await response.json();
        throw new Error(error.error?.message || "API调用失败");
      }
    } catch (error) {
      console.error("completions端点调用失败:", error);
      throw error;
    }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "OpenAI兼容API调用失败"
    };
  }
}

// Anthropic API调用
async function callAnthropic(
  provider: ProviderConfig,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  options: Record<string, any>
): Promise<ModelCallResponse> {
  try {
    const response = await fetch(`${provider.baseUrl}/messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": provider.apiKey,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens,
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Anthropic API调用失败");
    }

    const data = await response.json();

    return {
      success: true,
      content: data.content[0]?.text || "",
      usage: {
        promptTokens: 0, // Anthropic目前不提供token使用量
        completionTokens: 0,
        totalTokens: 0
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Anthropic API调用失败"
    };
  }
}

// OpenRouter API调用
async function callOpenRouter(
  provider: ProviderConfig,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  options: Record<string, any>
): Promise<ModelCallResponse> {
  try {
    const response = await fetch(`${provider.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        temperature,
        max_tokens: maxTokens,
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "OpenRouter API调用失败");
    }

    const data = await response.json();

    return {
      success: true,
      content: data.choices[0]?.message?.content || "",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "OpenRouter API调用失败"
    };
  }
}

// Google AI API调用
async function callGoogleAI(
  provider: ProviderConfig,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  options: Record<string, any>
): Promise<ModelCallResponse> {
  try {
    const response = await fetch(`${provider.baseUrl}/models/${model}:generateContent?key=${provider.apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        generationConfig: {
          temperature,
          maxOutputTokens: maxTokens,
          ...options
        }
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "Google AI API调用失败");
    }

    const data = await response.json();

    return {
      success: true,
      content: data.candidates[0]?.content?.parts[0]?.text || "",
      usage: {
        promptTokens: 0, // Google目前不提供token使用量
        completionTokens: 0,
        totalTokens: 0
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Google AI API调用失败"
    };
  }
}

// 自定义提供商API调用
async function callCustomProvider(
  provider: ProviderConfig,
  model: string,
  prompt: string,
  temperature: number,
  maxTokens: number,
  options: Record<string, any>
): Promise<ModelCallResponse> {
  try {
    // 自定义提供商需要根据实际情况实现
    const response = await fetch(`${provider.baseUrl}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${provider.apiKey}`
      },
      body: JSON.stringify({
        model,
        prompt,
        temperature,
        max_tokens: maxTokens,
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error?.message || "自定义API调用失败");
    }

    const data = await response.json();

    return {
      success: true,
      content: data.content || data.text || data.response || "",
      usage: {
        promptTokens: data.usage?.prompt_tokens || 0,
        completionTokens: data.usage?.completion_tokens || 0,
        totalTokens: data.usage?.total_tokens || 0
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "自定义API调用失败"
    };
  }
}
