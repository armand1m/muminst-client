import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import globalStyle from './globalStyle'
import { InstantButton } from './components/InstantButton'
import { ChannelSelector } from './components/ChannelSelector'
import { getChannels, getSounds, playSound } from './service'
import { Search } from './components/Search'
import { Channel } from './components/types'
import { storage } from './services/local'

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

const SearchWrapper = styled.div`
    margin-top: 40px;
    display: flex;
    flex-direction: column;
    font-family: 'Rubik';
`

const COOLDOWN = 3000 //ms

function App() {
    const [channels, setChannels] = useState<Channel[]>([])
    const [sounds, setSounds] = useState<string[]>([])
    const [search, setSearch] = useState<string>('')
    const [buttonsDisabled, setButtonsDisabled] = useState()
    const [favorites, setFavorites] = useState<string[]>([])

    useEffect(() => {
        const storedFavorites = storage.get('favorites')
        if (storedFavorites) {
            setFavorites(storedFavorites)
        } else {
            storage.remove('favorites')
        }
    }, [])

    useEffect(() => {
        getChannels().then(({ data }) => setChannels(data))
        getSounds().then(({ data }) => setSounds(data))
    }, [setChannels, setSounds])

    const filterBySearch = (sound: string) =>
        !search || sound.toLowerCase().includes(search.toLowerCase())

    const onClick = (sound: string) => {
        playSound(sound)
        setButtonsDisabled(true)
        setTimeout(() => setButtonsDisabled(false), COOLDOWN)
    }

    const addFavorite = (sound: string) => {
        const newFavorites = [...favorites, sound]
        setFavorites(newFavorites)
        storage.set('favorites', newFavorites)
    }
    const removeFavorite = (sound: string) => {
        console.log(sound)
        const newFavorites = favorites.filter((s) => s !== sound)
        setFavorites(newFavorites)
        storage.set('favorites', newFavorites)
    }

    const notInFavorites = (sound: string) => !favorites.includes(sound)

    return (
        <>
            <Global styles={globalStyle} />
            <MainContainer>
                <Title>Muminst</Title>
                <ChannelSelector channels={channels} />
                <SearchWrapper>
                    Search
                    <Search onChange={(evt) => setSearch(evt.target.value)} />
                </SearchWrapper>
                <ButtonsSection>
                    Favorites
                    {favorites.map((sound, index) => (
                        <InstantButton
                            key={`${sound}${index}`}
                            disabled={buttonsDisabled}
                            onFavorite={removeFavorite}
                            favText="Unfav"
                            name={sound}
                            onClick={() => onClick(sound)}
                        />
                    ))}
                </ButtonsSection>
                <ButtonsSection>
                    All
                    {sounds
                        .filter(notInFavorites)
                        .filter(filterBySearch)
                        .map((sound, index) => (
                            <InstantButton
                                key={`${sound}${index}`}
                                disabled={buttonsDisabled}
                                onFavorite={addFavorite}
                                favText="favorite"
                                name={sound}
                                onClick={() => onClick(sound)}
                            />
                        ))}
                </ButtonsSection>
            </MainContainer>
        </>
    )
}

export default App
