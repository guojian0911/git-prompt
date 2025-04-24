
import { Button } from "@/components/ui/button";
import { Moon, Sun } from "lucide-react";
import { useState } from "react";

export const ThemeToggle = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
      {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </Button>
  );
};
