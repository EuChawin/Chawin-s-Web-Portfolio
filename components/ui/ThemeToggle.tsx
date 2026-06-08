"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, Moon } from "lucide-react";
import { cn } from "@/lib/utils";

export function ThemeToggle({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className={cn("w-9 h-9 rounded-md", className)} />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      className={cn(
        "flex items-center justify-center w-9 h-9 rounded-md transition-all duration-200",
        "hover:bg-[var(--bg-surface-2)]",
        className
      )}
    >
      {theme === "dark" ? (
        <Sun size={16} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" />
      ) : (
        <Moon size={16} className="text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" />
      )}
    </button>
  );
}
