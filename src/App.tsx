import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import globalStyle from './globalStyle'
import { InstantButton } from './components/InstantButton'
import { ChannelSelector } from './components/ChannelSelector'
import { getChannels, getSounds, playSound } from './service'
import { Search } from './components/Search'

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
    margin-top: 25px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    width: 70%;
`

const ButtonsWrapper = styled.div`
    margin: 15px 20px;
    width: 100px;
`

const SearchWrapper = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    font-family: 'Rubik';
`

function App() {
    const [channels, setChannels] = useState<any[]>([])
    const [sounds, setSounds] = useState<string[]>([])
    const [filtred, setFiltred] = useState<string[]>([])
    const [search, setSearch] = useState<string>('')

    useEffect(() => {
        getChannels().then(({ data }) => {
            setChannels(data)
        })
        getSounds().then(({ data }: { data: string[] }) => {
            setSounds(data)
        })
    }, [setChannels, setSounds])

    const filter = (event: any) => {
        setSearch(event.target.value)
        setFiltred(
            sounds.filter((item) =>
                item.toLowerCase().includes(event.target.value.toLowerCase())
            )
        )
    }

    return (
        <>
            <Global styles={globalStyle} />
            <MainContainer>
                <Title>Muminst</Title>
                <ChannelSelector channels={channels} />
                <SearchWrapper>
                    Search
                    <Search onChange={filter} />
                </SearchWrapper>
                <ButtonsSection>
                    {search
                        ? filtred.map((sound, index) => (
                              <ButtonsWrapper key={`${sound}${index}`}>
                                  <InstantButton
                                      name={sound
                                          .split('.')
                                          .slice(0, -1)
                                          .join('')}
                                      onClick={() => playSound(sound)}
                                  />
                              </ButtonsWrapper>
                          ))
                        : sounds.map((sound, index) => (
                              <ButtonsWrapper key={`${sound}${index}`}>
                                  <InstantButton
                                      name={sound
                                          .split('.')
                                          .slice(0, -1)
                                          .join('')}
                                      onClick={() => playSound(sound)}
                                  />
                              </ButtonsWrapper>
                          ))}
                </ButtonsSection>
            </MainContainer>
        </>
    )
}

export default App
