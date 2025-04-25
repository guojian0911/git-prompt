import React from "react";
import { ModelInfo } from "@/constants/modelProviders";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Cpu } from "lucide-react";
import { cn } from "@/lib/utils";

interface ModelListProps {
  models: ModelInfo[];
  selectedModel?: string;
  onSelectModel: (modelId: string) => void;
  isLoading?: boolean;
}

const ModelList: React.FC<ModelListProps> = ({
  models,
  selectedModel,
  onSelectModel,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (models.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-40 text-muted-foreground">
        <Cpu className="h-10 w-10 mb-2" />
        <p>点击"测试连接"获取可用模型</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {models.map((model) => (
        <Card 
          key={model.id}
          className={cn(
            "cursor-pointer transition-all hover:shadow-md",
            selectedModel === model.id && "ring-2 ring-primary"
          )}
          onClick={() => onSelectModel(model.id)}
        >
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <CardTitle className="text-base">{model.name}</CardTitle>
              {selectedModel === model.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </div>
            <CardDescription className="text-xs">
              {model.contextWindow && `上下文窗口: ${model.contextWindow.toLocaleString()} tokens`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {model.capabilities && (
              <div className="flex flex-wrap gap-1">
                {model.capabilities.map((capability) => (
                  <span 
                    key={capability}
                    className="px-2 py-0.5 bg-secondary text-secondary-foreground rounded-full text-xs"
                  >
                    {capability}
                  </span>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default ModelList;
