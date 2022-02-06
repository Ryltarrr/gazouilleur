import { useTheme } from "next-themes";
import { MoonIcon, SunIcon } from "@heroicons/react/solid";
import { useEffect, useState } from "react";

// available themes: 'light', 'dark' and 'system'
const ThemeChanger = () => {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="flex space-x-2">
      {theme === "light" ? (
        <button
          className="rounded-full p-1 text-purple-500 transition hover:bg-purple-100"
          onClick={() => setTheme("dark")}
        >
          <MoonIcon className="h-6 w-6" />
        </button>
      ) : (
        <button
          className="rounded-full p-1 text-yellow-500 transition hover:bg-yellow-100"
          onClick={() => setTheme("light")}
        >
          <SunIcon className="h-6 w-6" />
        </button>
      )}
    </div>
  );
};

export default ThemeChanger;
