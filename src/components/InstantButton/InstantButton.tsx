import React from 'react';
import styled from '@emotion/styled';
import { IconButton } from 'theme-ui';
import { AiFillStar, AiOutlineStar } from 'react-icons/ai';
import { Sound } from 'features/api/useMuminstApi';
import { getButtonUrl } from 'features/buttons/getButtonUrl';

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

const ButtonWrapper = styled.div`
  margin: 15px 20px;
  width: 100px;
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
  onClick: () => void;
  onFavorite: (sound: Sound) => void;
}

export const InstantButton = ({
  sound,
  onClick,
  disabled,
  isFavorite,
  onFavorite,
}: Props) => (
  <ButtonWrapper>
    <Container>
      <Button
        disabled={disabled}
        color={nameToRgb(sound.name)}
        onClick={onClick}
      />
      <Text>{sound.name}</Text>

      <IconButton
        sx={{
          position: 'absolute',
          top: 0,
          right: 0,
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
    </Container>
  </ButtonWrapper>
);
