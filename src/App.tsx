import React, { useEffect, useState } from 'react';
import { useAsyncFn } from 'react-use';
import styled from '@emotion/styled';
import { Global } from '@emotion/core';
import globalStyle from './globalStyle';
import { InstantButton } from './components/InstantButton';
import { ChannelSelector } from './components/ChannelSelector';
import {
  getChannels,
  getSounds,
  playSound,
  uploadFiles,
  Sound,
} from './service';
import { Search } from './components/Search';
import { storage } from './services/local';
import { FileDropzone } from './components/FileDropzone';
import BarLoader from 'react-spinners/BarLoader';

const MainContainer = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
`;

const Title = styled.div`
  font-size: 75px;
  font-family: 'Rubik Mono One';
`;

const ButtonsSection = styled.div`
  margin-top: 25px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  width: 70%;
`;

const SearchWrapper = styled.div`
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  font-family: 'Rubik';
`;

const COOLDOWN = 3000; //ms

function App() {
  const [search, setSearch] = useState<string>('');
  const [buttonsDisabled, setButtonsDisabled] = useState(false);
  const [favorites, setFavorites] = useState<Sound[]>([]);

  const [channels, fetchChannels] = useAsyncFn(async () => {
    const { data } = await getChannels();
    return data;
  });

  const [sounds, fetchSounds] = useAsyncFn(async () => {
    const { data } = await getSounds();
    return data;
  });

  const [uploadState, triggerUpload] = useAsyncFn(
    async (files: File[]) => {
      const response = await uploadFiles(files);
      return response.data;
    },
    []
  );

  console.log(uploadState);

  useEffect(() => {
    const storedFavorites = storage.get('favorites');
    if (storedFavorites) {
      setFavorites(storedFavorites);
    } else {
      storage.remove('favorites');
    }
  }, []);

  useEffect(() => {
    fetchChannels();
    fetchSounds();
  }, [fetchChannels, fetchSounds]);

  const filterBySearch = (sound: Sound) =>
    !search ||
    sound.name.toLowerCase().includes(search.toLowerCase());

  const onClick = (sound: Sound) => {
    playSound(sound);
    setButtonsDisabled(true);
    setTimeout(() => setButtonsDisabled(false), COOLDOWN);
  };

  const addFavorite = (sound: Sound) => {
    const newFavorites = [...favorites, sound];
    setFavorites(newFavorites);
    storage.set('favorites', newFavorites);
  };
  const removeFavorite = (sound: Sound) => {
    const newFavorites = favorites.filter((s) => s.id !== sound.id);
    setFavorites(newFavorites);
    storage.set('favorites', newFavorites);
  };

  const notInFavorites = (sound: Sound) =>
    !favorites.map(({ id }) => id).includes(sound.id);

  return (
    <>
      <Global styles={globalStyle} />
      <MainContainer>
        <Title>Muminst</Title>
        {channels.loading || !channels.value ? (
          <BarLoader color={'#123abc'} loading={channels.loading} />
        ) : (
          <ChannelSelector channels={channels.value} />
        )}
        <FileDropzone onUpload={triggerUpload} />
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
          {sounds.loading || !sounds.value ? (
            <BarLoader color={'#123abc'} loading={sounds.loading} />
          ) : (
            sounds.value
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
              ))
          )}
        </ButtonsSection>
      </MainContainer>
    </>
  );
}

export default App;
