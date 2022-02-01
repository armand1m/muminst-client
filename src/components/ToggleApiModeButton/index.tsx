import React from 'react';
import { Box, IconButton } from 'theme-ui';
import { FaRust } from 'react-icons/fa';

interface Props {
  checked: boolean;
  onToggle: () => void;
}

export const ToggleApiModeButton = ({ checked, onToggle }: Props) => {
  return (
    <Box
      sx={{
        position: 'absolute',
        right: 3,
        top: 53,
      }}>
      <IconButton
        sx={{
          bg: checked ? 'red' : 'text',
          color: checked ? 'text' : 'background',
        }}
        onClick={onToggle}>
        <FaRust size={32} color="currentColor" />
      </IconButton>
    </Box>
  );
};
