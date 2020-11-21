import React from 'react';
import { css, keyframes } from '@emotion/react';
import { Button, ButtonProps } from 'theme-ui';

const pulseBoxShadow = keyframes`
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0.7);
  }

  70% {
    transform: scale(1);
    box-shadow: 0 0 0 10px rgba(255, 121, 63, 0);
  }

  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(255, 121, 63, 0);
  }
`;

interface RecordButtonProps {
  recording: boolean;
}

export const RecordButton: React.FC<
  RecordButtonProps & ButtonProps
> = ({ recording, ...props }) => (
  <Button
    {...props}
    sx={{
      width: 84,
      height: 84,
      borderRadius: '50%',
      cursor: 'pointer',
      border: '12px solid',
      borderColor: 'background',
      padding: 0,
      outline: 'none !important',
      boxShadow: '0px 0px 0px 2px red',
      backgroundColor: 'red',
      color: 'white',
    }}
    css={css`
      animation: ${pulseBoxShadow} ${recording ? '2s' : '0s'} infinite;
    `}
  />
);
