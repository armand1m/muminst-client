import React from 'react'
import styled from '@emotion/styled'
import { InstantButton } from './components/InstantButton'
import { Global } from '@emotion/core'
import globalStyle from './globalStyle'

const MainContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

const Title = styled.div`
    font-size: 75px;
    font-family: 'Rubik Mono One';
`

function App() {
    return (
        <>
            <Global styles={globalStyle} />
            <MainContainer>
                <Title>Muminst</Title>
                <InstantButton name='Fausto' />
            </MainContainer>
        </>
    )
}

export default App
