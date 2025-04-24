
import { Link } from "react-router-dom";

interface CategoryButtonProps {
  name: string;
  icon: string;
  slug: string;
  count: number;
  isSelected?: boolean;
  onClick?: () => void;
}

const CategoryButton = ({ name, icon, slug, count, isSelected, onClick }: CategoryButtonProps) => {
  const baseClasses = "flex items-center justify-between glass-card rounded-xl p-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group";
  const selectedClasses = isSelected ? "ring-2 ring-shumer-purple bg-shumer-purple/5" : "";

  return (
    <button 
      onClick={onClick}
      className={`${baseClasses} ${selectedClasses}`}
    >
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-primary flex items-center justify-center text-white shrink-0">
          {icon}
        </div>
        <span className="font-medium text-slate-800 dark:text-white group-hover:text-shumer-purple transition-colors">
          {name}
        </span>
      </div>
      <span className="text-sm text-slate-500 dark:text-slate-400 px-2 py-1 bg-slate-100 dark:bg-slate-800 rounded-full">
        {count}
      </span>
    </button>
  );
};

export default CategoryButton;
