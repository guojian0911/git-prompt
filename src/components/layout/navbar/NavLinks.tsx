
import { Link } from "react-router-dom";

export const NavLinks = () => {
  return (
    <div className="hidden md:flex items-center space-x-8">
      <Link to="/explore" className="text-slate-700 dark:text-slate-200 hover:text-shumer-purple dark:hover:text-shumer-purple transition-colors">
        探索
      </Link>
      <Link to="/categories" className="text-slate-700 dark:text-slate-200 hover:text-shumer-purple dark:hover:text-shumer-purple transition-colors">
        分类
      </Link>
    </div>
  );
};
