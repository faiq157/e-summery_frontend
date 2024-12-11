import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/components/theme-provider";

export function ModeToggle() {
  const { theme, setTheme } = useTheme(); // Get the current theme

  return (
    <Button
      variant="outline"
      className="rounded-full" 
      size="icon"
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")} 
    >
      {theme === "dark" ? ( 
        <Sun className="h-[1.2rem] w-[1.2rem]" /> 
      ) : (
        <Moon className="h-[1.2rem] w-[1.2rem]" />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
