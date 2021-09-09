import React from 'react';
import styled from '@emotion/styled';
import { Box, Grid, IconButton } from 'theme-ui';
import {
  AiFillStar,
  AiFillTags,
  AiOutlineStar,
} from 'react-icons/ai';
import { BsPlayFill } from 'react-icons/bs';
import { Sound } from 'features/api/useMuminstApi';
import { getButtonUrl } from 'features/buttons/getButtonUrl';
import { Tags } from 'components/Tags';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

const Button = styled.button<{ color: string }>`
  width: 94px;
  height: 89px;
  border-radius: 150px;
  border: none;
  outline: none;
  background-image: url(${getButtonUrl('normal')});
  cursor: pointer;
  background-color: ${({ color }) => color};
  transition: opacity 0.15s;
  &:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }
  &:active {
    background-image: url(${getButtonUrl('pressed')});
  }
`;

const Text = styled.div`
  font-size: 16px;
  margin-top: 7px;
  font-family: 'Rubik';
  text-align: center;
`;

const hashCode = (str: string) =>
  str
    .split('')
    .reduce(
      (hash, _, i) => str.charCodeAt(i) + ((hash << 5) - hash),
      0
    );

const intToRGB = (i: number) => {
  const c = (i & 0x00ffffff).toString(16).toUpperCase();
  return '#' + ('00000'.substring(0, 6 - c.length) + c);
};

const nameToRgb = (name: string) => {
  return intToRGB(hashCode(name));
};

interface Props {
  sound: Sound;
  disabled: boolean;
  isFavorite?: boolean;
  onClick: (sound: Sound) => void;
  onPlayPreview: (sound: Sound) => void;
  onFavorite: (sound: Sound) => void;
  onAddTag: () => void;
}

export const InstantButton = ({
  sound,
  onClick,
  disabled,
  isFavorite,
  onPlayPreview,
  onFavorite,
  onAddTag,
}: Props) => (
  <Box
    sx={{
      width: '100px',
      wordBreak: 'break-word',
      marginX: ['12px', 3],
      marginY: 3,
    }}>
    <Container>
      <Button
        disabled={disabled}
        color={nameToRgb(sound.name)}
        onClick={() => onClick(sound)}
      />
      <Text>{sound.name}</Text>

      <Tags tags={sound.tags} />

      <Grid
        gap={2}
        sx={{
          position: 'absolute',
          alignItems: 'center',
          justifyContent: 'center',
          top: -15,
          right: -20,
        }}>
        <IconButton
          sx={{
            color: 'text',
            bg: 'secondary',
          }}
          onClick={() => onFavorite(sound)}
          aria-label={
            isFavorite ? 'Remove from favorite' : 'Add to favorite'
          }>
          {isFavorite ? (
            <AiFillStar color="currentColor" />
          ) : (
            <AiOutlineStar color="currentColor" />
          )}
        </IconButton>
        <IconButton
          sx={{
            color: 'text',
            bg: 'secondary',
          }}
          onClick={() => onPlayPreview(sound)}
          aria-label="Play sound on the browser">
          <BsPlayFill color="currentColor" />
        </IconButton>
        <IconButton
          sx={{
            color: 'text',
            bg: 'secondary',
          }}
          onClick={onAddTag}
          aria-label="Add new tag">
          <AiFillTags color="currentColor" />
        </IconButton>
      </Grid>
    </Container>
  </Box>
);
