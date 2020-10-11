import React from 'react';
import styled from '@emotion/styled';
import { getButtonUrl } from '../../constants';
import { Sound } from '../../service';

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

const ButtonsWrapper = styled.div`
  padding: 15px 20px;
  width: 100px;
`;

const nameToRgb = (name: string) => {
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

  return intToRGB(hashCode(name));
};

type Props = {
  sound: Sound;
  disabled: boolean;
  onClick: () => void;
  onFavorite: (sound: Sound) => void;
};

export const InstantButton = ({
  sound,
  onClick,
  disabled,
  onFavorite,
}: Props) => (
  <ButtonsWrapper>
    <Container>
      <Button
        disabled={disabled}
        color={nameToRgb(sound.name)}
        onClick={onClick}
      />
      <Text>{sound.name}</Text>

      <button
        style={{
          position: 'absolute',
          top: 0,
          right: 0,
        }}
        onClick={() => onFavorite(sound)}>
        +
      </button>
    </Container>
  </ButtonsWrapper>
);
