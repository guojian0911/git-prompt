import React, { useState } from "react";
import { useModelSettings } from "@/contexts/ModelSettingsContext";
import { MODEL_PROVIDERS } from "@/constants/modelProviders";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ModelProviderItem from "@/components/model/ModelProviderItem";
import ProviderForm from "@/components/model/ProviderForm";
import ModelList from "@/components/model/ModelList";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const ModelSettings = () => {
  const { 
    activeProvider, 
    setActiveProvider, 
    availableModels, 
    settings, 
    setDefaultModel 
  } = useModelSettings();
  
  // 当前选中的提供商
  const [selectedProviderId, setSelectedProviderId] = useState<string>(
    activeProvider?.id || MODEL_PROVIDERS[0].id
  );
  
  // 获取当前选中的提供商信息
  const selectedProvider = MODEL_PROVIDERS.find(p => p.id === selectedProviderId);
  
  // 处理提供商选择
  const handleProviderSelect = (providerId: string) => {
    setSelectedProviderId(providerId);
  };
  
  // 处理模型选择
  const handleModelSelect = (modelId: string) => {
    setDefaultModel(modelId);
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">模型设置</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {/* 左侧提供商列表 */}
          <div className="md:col-span-1 space-y-1">
            <h2 className="text-lg font-medium mb-4">提供商</h2>
            
            <div className="space-y-1">
              {MODEL_PROVIDERS.map((provider) => (
                <ModelProviderItem
                  key={provider.id}
                  provider={provider}
                  isActive={selectedProviderId === provider.id}
                  onClick={() => handleProviderSelect(provider.id)}
                />
              ))}
            </div>
          </div>
          
          {/* 右侧配置区域 */}
          <div className="md:col-span-3">
            {selectedProvider && (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">{selectedProvider.name}</h2>
                  <p className="text-sm text-muted-foreground">{selectedProvider.description}</p>
                </div>
                
                <Tabs defaultValue="config">
                  <TabsList className="mb-6">
                    <TabsTrigger value="config">配置</TabsTrigger>
                    <TabsTrigger value="models">模型列表</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="config">
                    <ProviderForm provider={selectedProvider} />
                  </TabsContent>
                  
                  <TabsContent value="models">
                    <ModelList
                      models={availableModels.filter(m => m.provider === selectedProviderId)}
                      selectedModel={settings.defaultModel}
                      onSelectModel={handleModelSelect}
                    />
                  </TabsContent>
                </Tabs>
              </>
            )}
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ModelSettings;
