import { useCallback } from 'react';
import { useColorMode as useThemeUIColorMode } from 'theme-ui';
import { ColorMode } from '.';

export const useColorMode = () => {
  const [colorMode, setColorMode] = useThemeUIColorMode();

  const toggle = useCallback(() => {
    setColorMode(
      colorMode === ColorMode.Light ? ColorMode.Dark : ColorMode.Light
    );
  }, [colorMode, setColorMode]);

  type ColorModeHook = [typeof colorMode, typeof toggle];

  return [colorMode, toggle] as ColorModeHook;
};
