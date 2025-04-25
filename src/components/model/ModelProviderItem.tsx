import React from "react";
import { cn } from "@/lib/utils";
import { ModelProvider } from "@/constants/modelProviders";

interface ModelProviderItemProps {
  provider: ModelProvider;
  isActive: boolean;
  onClick: () => void;
}

const ModelProviderItem: React.FC<ModelProviderItemProps> = ({
  provider,
  isActive,
  onClick
}) => {
  const Icon = provider.icon;
  
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center w-full px-4 py-3 rounded-lg transition-all",
        "hover:bg-accent hover:text-accent-foreground",
        isActive && "bg-accent text-accent-foreground font-medium"
      )}
    >
      <Icon className="mr-3 h-5 w-5 shrink-0" />
      <span>{provider.name}</span>
    </button>
  );
};

export default ModelProviderItem;
