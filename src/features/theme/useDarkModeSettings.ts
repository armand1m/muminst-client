import { useThemeToggle } from './useThemeToggle';
import { useCurrentColorMode } from './useCurrentColorMode';

export const useDarkModeSettings = () => {
  const currentColorMode = useCurrentColorMode();
  const toggleTheme = useThemeToggle();
  const isDarkMode = currentColorMode === 'dark';

  type DarkModeSettingsHook = [typeof isDarkMode, typeof toggleTheme];

  return [isDarkMode, toggleTheme] as DarkModeSettingsHook;
};
