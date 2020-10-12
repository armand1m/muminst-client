import { useColorMode } from 'theme-ui';
import { ColorMode } from '.';

export const useCurrentColorMode = () => {
  const [colorMode] = useColorMode<ColorMode>();
  return colorMode;
};
