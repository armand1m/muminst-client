import { useColorMode } from 'features/theme/useColorMode';
import React from 'react';
import { Box, IconButton } from 'theme-ui';
import { VscColorMode } from 'react-icons/vsc';

export const ToggleColorModeButton = () => {
  const [, toggle] = useColorMode();

  return (
    <Box
      sx={{
        position: 'absolute',
        right: 3,
        top: 3,
      }}>
      <IconButton
        sx={{ bg: 'text', color: 'background' }}
        onClick={toggle}>
        <VscColorMode size={32} color="currentColor" />
      </IconButton>
    </Box>
  );
};
