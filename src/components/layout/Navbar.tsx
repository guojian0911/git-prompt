
import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { SearchDialog } from "./navbar/SearchDialog";
import { ThemeToggle } from "./navbar/ThemeToggle";
import { NavLinks } from "./navbar/NavLinks";
import { UserMenu } from "./navbar/UserMenu";
import { MobileMenu } from "./navbar/MobileMenu";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { signOut } = useAuth();

  return (
    <nav className="sticky top-0 z-50 w-full backdrop-blur-lg bg-white/70 dark:bg-slate-900/70 border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-primary rounded-lg w-8 h-8 flex items-center justify-center text-white font-bold">G</div>
            <span className="text-xl font-bold gradient-text">GitPrompt</span>
          </Link>

          <NavLinks />

          <div className="hidden md:flex items-center space-x-4">
            <SearchDialog />
            <ThemeToggle />
            <UserMenu />
          </div>

          <div className="flex md:hidden items-center space-x-4">
            <ThemeToggle />
            <Button variant="ghost" size="icon" onClick={() => setIsOpen(!isOpen)}>
              {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        <MobileMenu 
          isOpen={isOpen} 
          onClose={() => setIsOpen(false)}
          onLogout={signOut}
        />
      </div>
    </nav>
  );
};

export default Navbar;
