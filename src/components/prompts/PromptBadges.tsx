
import { Badge } from "@/components/ui/badge";
import { categories } from "@/constants/categories";

interface PromptBadgesProps {
  category: string;
  isPrivate?: boolean;
  isForkPrompt?: boolean;
  isPersonalPage?: boolean;
}

export const PromptBadges = ({
  category,
  isPrivate,
  isForkPrompt,
  isPersonalPage
}: PromptBadgesProps) => {
  // 根据 category 值查找对应的 label
  const getCategoryLabel = (categoryValue: string) => {
    const categoryItem = categories.find(item => item.value === categoryValue);
    return categoryItem ? categoryItem.label : categoryValue;
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{getCategoryLabel(category)}</Badge>
      {isPrivate && isPersonalPage && (
        <Badge variant="outline" className="border-yellow-500 text-yellow-500">
          私有
        </Badge>
      )}
      {isForkPrompt && (
        <Badge variant="outline" className="border-purple-500 text-purple-500">
          Fork
        </Badge>
      )}
    </div>
  );
};
