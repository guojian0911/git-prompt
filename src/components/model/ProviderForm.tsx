import React, { useState, useEffect } from "react";
import { useModelSettings } from "@/contexts/ModelSettingsContext";
import { ModelProvider, ProviderConfig } from "@/constants/modelProviders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, RefreshCw, Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";

interface ProviderFormProps {
  provider: ModelProvider;
}

const ProviderForm: React.FC<ProviderFormProps> = ({ provider }) => {
  const { providers, saveProvider, testConnection, isLoading } = useModelSettings();
  
  // 查找现有配置
  const existingConfig = providers.find(p => p.id === provider.id);
  
  // 表单状态
  const [formData, setFormData] = useState<Partial<ProviderConfig>>({
    id: provider.id,
    name: provider.name,
    apiKey: "",
    baseUrl: provider.defaultBaseUrl,
    isActive: true,
    customSettings: {}
  });
  
  // 显示/隐藏API密钥
  const [showApiKey, setShowApiKey] = useState(false);
  
  // 加载现有配置
  useEffect(() => {
    if (existingConfig) {
      setFormData({
        ...existingConfig
      });
    } else {
      setFormData({
        id: provider.id,
        name: provider.name,
        apiKey: "",
        baseUrl: provider.defaultBaseUrl,
        isActive: true,
        customSettings: {}
      });
    }
  }, [provider.id, provider.name, provider.defaultBaseUrl, existingConfig]);
  
  // 处理输入变化
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // 处理开关变化
  const handleSwitchChange = (checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      isActive: checked
    }));
  };
  
  // 保存配置
  const handleSave = () => {
    if (!formData.apiKey) {
      toast.error("请输入API密钥");
      return;
    }
    
    saveProvider(formData as ProviderConfig);
    toast.success("配置已保存");
  };
  
  // 测试连接
  const handleTest = async () => {
    if (!formData.apiKey) {
      toast.error("请输入API密钥");
      return;
    }
    
    const result = await testConnection(formData as ProviderConfig);
    
    if (result.success) {
      toast.success("连接成功，已获取可用模型");
    } else {
      toast.error(`连接失败: ${result.error}`);
    }
  };
  
  // 重置为默认URL
  const handleResetUrl = () => {
    setFormData(prev => ({
      ...prev,
      baseUrl: provider.defaultBaseUrl
    }));
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="apiKey">API密钥</Label>
          <div className="relative">
            <Input
              id="apiKey"
              name="apiKey"
              type={showApiKey ? "text" : "password"}
              value={formData.apiKey}
              onChange={handleChange}
              placeholder={`输入${provider.name} API密钥`}
              className="pr-10"
            />
            <button
              type="button"
              onClick={() => setShowApiKey(!showApiKey)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showApiKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            API密钥将安全地存储在您的浏览器中
          </p>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="baseUrl">API基础URL</Label>
          <div className="relative">
            <Input
              id="baseUrl"
              name="baseUrl"
              type="text"
              value={formData.baseUrl}
              onChange={handleChange}
              placeholder="API基础URL"
              className="pr-10"
            />
            <button
              type="button"
              onClick={handleResetUrl}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              title="重置为默认URL"
            >
              <RefreshCw className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="active">启用</Label>
            <p className="text-xs text-muted-foreground">
              启用此提供商用于模型调用
            </p>
          </div>
          <Switch
            id="active"
            checked={formData.isActive}
            onCheckedChange={handleSwitchChange}
          />
        </div>
      </div>
      
      <div className="flex space-x-2">
        <Button
          variant="outline"
          onClick={handleTest}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              测试中...
            </>
          ) : (
            "测试连接"
          )}
        </Button>
        <Button onClick={handleSave} disabled={isLoading}>
          保存配置
        </Button>
      </div>
    </div>
  );
};

export default ProviderForm;
