import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { getButtonUrl } from '../../constants'

type Props = {
    name: string
    onClick: () => void
}

const hexMaxValue = 16777215

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Button = styled.div<{ color: string }>`
    width: 94px;
    height: 89px;
    border-radius: 150px;
    background-image: url(${getButtonUrl('normal')});
    cursor: pointer;
    background-color: ${({ color }) => color};
    &:active {
        background-image: url(${getButtonUrl('pressed')});
    }
`
const Text = styled.div`
    font-size: 16px;
    margin-top: 7px;
    font-family: 'Rubik';
`

export const InstantButton = ({ name, onClick }: Props) => {
    const randomColor = useMemo(
        () => `#${Math.floor(Math.random() * hexMaxValue).toString(16)}`,
        []
    )

    return (
        <Container>
            <Button color={randomColor} onClick={onClick} />
            <Text>{name}</Text>
        </Container>
    )
}
