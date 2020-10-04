import React from 'react'
import styled from '@emotion/styled'

type Props = {
    name?: string
}

const hexMaxValue = 16777215
const randomColor = '#' + Math.floor(Math.random() * hexMaxValue).toString(16)

const Container = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
`
const Button = styled.div`
    width: 94px;
    height: 89px;
    border-radius: 150px;
    background-image: url('https://www.myinstants.com/media/images/transparent_button_small_normal.png');
    cursor: pointer;
    background-color: ${randomColor};
    &:active {
        background-image: url('https://www.myinstants.com/media/images/transparent_button_small_pressed.png');
    }
`
const Text = styled.div`
    font-size: 16px;
    margin-top: 7px;
    font-family: 'Rubik';
`

export const InstantButton = ({ name = 'no-name' }: Props) => {
    return (
        <Container>
            <Button />
            <Text>{name}</Text>
        </Container>
    )
}
