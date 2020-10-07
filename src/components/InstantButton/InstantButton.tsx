import React from 'react'
import styled from '@emotion/styled'
import { getButtonUrl } from '../../constants'

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
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
`
const Text = styled.div`
    font-size: 16px;
    margin-top: 7px;
    font-family: 'Rubik';
    text-align: center;
`

type Props = {
    name: string
    disabled: boolean
    onClick: () => void
}

const nameToRgb = (name: string) => {
    const hashCode = (str: string) =>
        str
            .split('')
            .reduce((hash, _, i) => str.charCodeAt(i) + ((hash << 5) - hash), 0)

    const intToRGB = (i: number) => {
        const c = (i & 0x00ffffff).toString(16).toUpperCase()
        return '#' + ('00000'.substring(0, 6 - c.length) + c)
    }

    return intToRGB(hashCode(name))
}

export const InstantButton = ({ name, onClick, disabled }: Props) => {
    return (
        <Container>
            <Button
                disabled={disabled}
                color={nameToRgb(name)}
                onClick={onClick}
            />
            <Text>{name}</Text>
        </Container>
    )
}
