import React, { useState } from "react";
import { useModelSettings } from "@/contexts/ModelSettingsContext";
import { callModel, replaceVariables, highlightVariables as highlightVariablesString } from "@/lib/modelUtils";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Slider } from "@/components/ui/slider";
import { Label } from "@/components/ui/label";
import { Loader2, Send, Thermometer, Zap } from "lucide-react";
import { toast } from "sonner";
import ModelSelector from "./ModelSelector";
import VariableInput from "../prompt/VariableInput";

interface ModelCallerProps {
  prompt: string;
}

const ModelCaller: React.FC<ModelCallerProps> = ({ prompt }) => {
  const { activeProvider, settings } = useModelSettings();

  // 状态
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [temperature, setTemperature] = useState(settings.defaultTemperature);
  const [maxTokens, setMaxTokens] = useState(settings.defaultMaxTokens);
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState("");

  // 处理变量变化
  const handleVariablesChange = (newVariables: Record<string, string>) => {
    setVariables(newVariables);
  };

  // 处理温度变化
  const handleTemperatureChange = (value: number[]) => {
    setTemperature(value[0]);
  };

  // 处理最大令牌数变化
  const handleMaxTokensChange = (value: number[]) => {
    setMaxTokens(value[0]);
  };

  // 调用模型
  const handleCallModel = async () => {
    if (!activeProvider) {
      toast.error("请先配置模型提供商");
      return;
    }

    if (!settings.defaultModel) {
      toast.error("请先选择模型");
      return;
    }

    setIsLoading(true);
    setResponse("");

    try {
      const result = await callModel({
        provider: activeProvider,
        model: settings.defaultModel,
        prompt,
        variables,
        temperature,
        maxTokens
      });

      if (result.success) {
        setResponse(result.content || "");
      } else {
        toast.error(`调用失败: ${result.error}`);
      }
    } catch (error) {
      toast.error("调用模型时发生错误");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  // 获取处理后的提示词（替换变量）
  const processedPrompt = replaceVariables(prompt, variables);

  return (
    <div className="space-y-6">
      {/* 模型选择器 */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold">使用AI模型</h2>
        <ModelSelector />
      </div>

      {/* 变量输入 */}
      <VariableInput prompt={prompt} onChange={handleVariablesChange} />

      {/* 提示词预览 - 与预览选项卡保持一致的样式 */}
      <div className="bg-slate-50 dark:bg-slate-800/50 rounded-lg p-6">
        <pre className="whitespace-pre-wrap text-slate-700 dark:text-slate-300 text-sm">
          {Object.values(variables).some(value => value.trim() !== "")
            ? processedPrompt
            : <div dangerouslySetInnerHTML={{ __html: highlightVariablesString(prompt) }} />}
        </pre>
      </div>

      {/* 模型参数 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center">
              <Thermometer className="h-4 w-4 mr-1" />
              温度: {temperature.toFixed(1)}
            </Label>
          </div>
          <Slider
            value={[temperature]}
            min={0}
            max={1}
            step={0.1}
            onValueChange={handleTemperatureChange}
          />
          <p className="text-xs text-muted-foreground">
            较低的值使输出更确定，较高的值使输出更随机
          </p>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="flex items-center">
              <Zap className="h-4 w-4 mr-1" />
              最大令牌数: {maxTokens}
            </Label>
          </div>
          <Slider
            value={[maxTokens]}
            min={100}
            max={4000}
            step={100}
            onValueChange={handleMaxTokensChange}
          />
          <p className="text-xs text-muted-foreground">
            限制模型生成的最大令牌数量
          </p>
        </div>
      </div>

      {/* 调用按钮 */}
      <Button
        onClick={handleCallModel}
        disabled={isLoading || !activeProvider || !settings.defaultModel}
        className="w-full"
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            生成中...
          </>
        ) : (
          <>
            <Send className="mr-2 h-4 w-4" />
            生成回复
          </>
        )}
      </Button>

      {/* 响应结果 */}
      {response && (
        <div className="space-y-2">
          <Label>AI回复</Label>
          <Textarea
            value={response}
            readOnly
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      )}
    </div>
  );
};

export default ModelCaller;
