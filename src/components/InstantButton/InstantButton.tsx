import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { getButtonUrl } from '../../constants'

const hexMaxValue = 16777215

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

function hashCode(str: string) {
    // java String#hashCode
    let hash = 0
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }
    return hash
}

function intToRGB(i: number) {
    const c = (i & 0x00ffffff).toString(16).toUpperCase()
    console.log(c)
    return '#' + ('00000'.substring(0, 6 - c.length) + c)
}

export const InstantButton = ({ name, onClick, disabled }: Props) => {
    const color = intToRGB(hashCode(name))

    return (
        <Container>
            <Button disabled={disabled} color={color} onClick={onClick} />
            <Text>{name}</Text>
        </Container>
    )
}
