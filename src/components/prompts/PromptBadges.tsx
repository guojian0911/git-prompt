
import { Badge } from "@/components/ui/badge";

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
  return (
    <div className="flex flex-wrap gap-2">
      <Badge variant="secondary">{category}</Badge>
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
