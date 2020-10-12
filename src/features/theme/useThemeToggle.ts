import { useCallback } from 'react';
import { useColorMode } from 'theme-ui';
import { ColorMode } from '.';

export const useThemeToggle = () => {
  const [colorMode, setColorMode] = useColorMode();

  const toggle = useCallback(() => {
    setColorMode(
      colorMode === ColorMode.Light ? ColorMode.Dark : ColorMode.Light
    );
  }, [colorMode, setColorMode]);

  return toggle;
};
