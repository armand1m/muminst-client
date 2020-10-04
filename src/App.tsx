import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import globalStyle from './globalStyle'
import { InstantButton } from './components/InstantButton'
import { ChannelSelector } from './components/ChannelSelector'
import { getChannels } from './service'

const MainContainer = styled.div`
    display: flex;
    align-items: center;
    flex-direction: column;
`

const Title = styled.div`
    font-size: 75px;
    font-family: 'Rubik Mono One';
`

const ButtonsSection = styled.div`
    margin-top: 60px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 70%;
`

const ButtonsWrapper = styled.div`
    margin: 15px 20px;
`

function App() {
    const [channels, setChannels] = useState<any[]>([])

    useEffect(() => {
        getChannels().then(({ data }) => {
            setChannels(data)
        })
    }, [setChannels])

    return (
        <>
            <Global styles={globalStyle} />
            <MainContainer>
                <Title>Muminst</Title>
                <ChannelSelector channels={channels} />
                <ButtonsSection>
                    {Array(25)
                        .fill(0)
                        .map((_, index) => (
                            <ButtonsWrapper>
                                <InstantButton name="Fausto" key={index} />
                            </ButtonsWrapper>
                        ))}
                </ButtonsSection>
            </MainContainer>
        </>
    )
}

export default App
