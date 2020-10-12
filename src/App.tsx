import React from 'react';
import styled from '@emotion/styled';
import { useEffectOnce } from 'react-use';
import {
  Box,
  Flex,
  Grid,
  Heading,
  Input,
  Label,
  Select,
  Spinner,
  Text,
} from 'theme-ui';

import { Centered } from 'components/Centered';
import { PageHeading } from 'components/PageHeading';
import { FileDropzone } from 'components/FileDropzone';
import { InstantButton } from 'components/InstantButton';
import { AsyncResource } from 'components/AsyncResource';
import { useFavorites } from 'features/favorites/useFavorites';
import { useLock } from 'features/lock/useLock';
import { useSearch } from 'features/search/useSearch';
import { Sound, useMuminstApi } from 'features/api/useMuminstApi';

const ButtonsSection = styled(Flex)`
  flex-wrap: wrap;
  justify-content: center;
`;

const Loader = () => (
  <Centered>
    <Spinner />
  </Centered>
);

export function App() {
  const { search, setSearch, matchSearch } = useSearch();
  const [isLocked, lock] = useLock();
  const [
    favorites,
    addFavorite,
    removeFavorite,
    hasFavorite,
  ] = useFavorites();

  const {
    state: { channels, sounds, upload },
    handlers: {
      fetchChannels,
      fetchSounds,
      triggerUpload,
      playSound,
    },
  } = useMuminstApi();

  useEffectOnce(() => {
    fetchChannels();
    fetchSounds();
  });

  const onPlay = (sound: Sound) => {
    playSound(sound);
    lock();
  };

  return (
    <Centered>
      <Grid
        gap={3}
        columns={['minmax(0, 1fr)', 'minmax(0, 1fr)', '720px']}
        sx={{ padding: 4 }}>
        <Centered>
          <PageHeading>Muminst</PageHeading>
        </Centered>

        <FileDropzone uploadState={upload} onUpload={triggerUpload} />

        <AsyncResource state={channels} fallback={<Loader />}>
          {(mumbleChannels) => (
            <Box>
              <Label htmlFor="channel">Channel</Label>
              <Select id="channel">
                {mumbleChannels.map((channel) => (
                  <option key={channel.id}>{channel.name}</option>
                ))}
              </Select>
            </Box>
          )}
        </AsyncResource>

        <Box>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </Box>

        <Box>
          <Heading as="h2">Favorites</Heading>
          <ButtonsSection>
            {favorites.map((sound) => (
              <InstantButton
                key={sound.id}
                disabled={isLocked}
                isFavorite
                onFavorite={removeFavorite}
                sound={sound}
                onClick={() => onPlay(sound)}
              />
            ))}
          </ButtonsSection>
        </Box>

        <Box>
          <Heading as="h2">All</Heading>
          <ButtonsSection>
            <AsyncResource state={sounds} fallback={<Loader />}>
              {(allSounds) => {
                const filtered = allSounds
                  .filter((sound) => !hasFavorite(sound))
                  .filter(matchSearch);

                if (filtered.length === 0) {
                  return <Text>No results for "{search}"</Text>;
                }

                return (
                  <>
                    {filtered.map((sound) => (
                      <InstantButton
                        key={sound.id}
                        isFavorite={false}
                        disabled={isLocked}
                        onFavorite={addFavorite}
                        sound={sound}
                        onClick={() => onPlay(sound)}
                      />
                    ))}
                  </>
                );
              }}
            </AsyncResource>
          </ButtonsSection>
        </Box>
      </Grid>
    </Centered>
  );
}
