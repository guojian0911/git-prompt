import React from "react";
import { useModelSettings } from "@/contexts/ModelSettingsContext";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";
import { Link } from "react-router-dom";

interface ModelSelectorProps {
  onModelChange?: (modelId: string) => void;
}

const ModelSelector: React.FC<ModelSelectorProps> = ({ onModelChange }) => {
  const { providers, availableModels, settings, setDefaultModel } = useModelSettings();
  
  // 检查是否有可用的提供商
  const hasProviders = providers.length > 0;
  
  // 获取当前活跃的提供商
  const activeProvider = providers.find(p => p.id === settings.defaultProvider);
  
  // 获取当前提供商的可用模型
  const providerModels = availableModels.filter(
    m => m.provider === settings.defaultProvider
  );
  
  // 处理模型变更
  const handleModelChange = (modelId: string) => {
    setDefaultModel(modelId);
    if (onModelChange) {
      onModelChange(modelId);
    }
  };
  
  if (!hasProviders) {
    return (
      <div className="flex items-center space-x-2">
        <span className="text-sm text-muted-foreground">未配置模型</span>
        <Link to="/model-settings">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-1" />
            配置
          </Button>
        </Link>
      </div>
    );
  }
  
  return (
    <div className="flex items-center space-x-2">
      <Select
        value={settings.defaultModel || ""}
        onValueChange={handleModelChange}
      >
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="选择模型" />
        </SelectTrigger>
        <SelectContent>
          {providerModels.length > 0 ? (
            providerModels.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))
          ) : (
            <SelectItem value="none" disabled>
              无可用模型
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      
      <Link to="/model-settings">
        <Button variant="outline" size="icon">
          <Settings className="h-4 w-4" />
        </Button>
      </Link>
    </div>
  );
};

export default ModelSelector;
