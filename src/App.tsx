import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { Global } from '@emotion/core'
import globalStyle from './globalStyle'
import { InstantButton } from './components/InstantButton'
import { ChannelSelector } from './components/ChannelSelector'
import { getChannels, getSounds, playSound, Sound } from './service'
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
    const [search, setSearch] = useState<string>('')
    const [buttonsDisabled, setButtonsDisabled] = useState()
    const [sounds, setSounds] = useState<Sound[]>([])
    const [favorites, setFavorites] = useState<Sound[]>([])

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
        getSounds().then(({ data }) => {
            setSounds(data)
        })
    }, [setChannels, setSounds])

    const filterBySearch = (sound: Sound) =>
        !search || sound.name.toLowerCase().includes(search.toLowerCase())

    const onClick = (sound: Sound) => {
        playSound(sound)
        setButtonsDisabled(true)
        setTimeout(() => setButtonsDisabled(false), COOLDOWN)
    }

    const addFavorite = (sound: Sound) => {
        const newFavorites = [...favorites, sound]
        setFavorites(newFavorites)
        storage.set('favorites', newFavorites)
    }
    const removeFavorite = (sound: Sound) => {
        const newFavorites = favorites.filter((s) => s.id !== sound.id)
        setFavorites(newFavorites)
        storage.set('favorites', newFavorites)
    }

    const notInFavorites = (sound: Sound) =>
        !favorites.map(({ id }) => id).includes(sound.id)

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
                            sound={sound}
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
                                sound={sound}
                                onClick={() => onClick(sound)}
                            />
                        ))}
                </ButtonsSection>
            </MainContainer>
        </>
    )
}

export default App
