import React, { useState, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { useEffectOnce } from 'react-use';
import { ErrorBoundary } from '@sentry/react';
import {
  Box,
  Button,
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
import { Recorder } from 'features/recording/Recorder';
import { useSearch } from 'features/search/useSearch';
import { useFavorites } from 'features/favorites/useFavorites';
import { useLock } from 'features/lock/useLock';
import { useLockSocket } from 'features/lock/useLockSocket';
import {
  Sound,
  ChatClient,
  useMuminstApi,
} from 'features/api/useMuminstApi';
import { fuzzyFilter } from 'features/search/useFuzzyFilter/fuzzyFilter';

const ButtonsSection = styled(Flex)`
  flex-wrap: wrap;
  justify-content: center;
`;

const Loader = () => (
  <Centered>
    <Spinner />
  </Centered>
);

const FetchSoundsFailed: React.FC<{ resetError: () => void }> = ({
  resetError,
}) => (
  <Centered sx={{ flexDirection: 'column' }}>
    <Grid gap={2}>
      <Text>Failed to fetch sounds.</Text>
      <Button onClick={resetError}>Retry</Button>
    </Grid>
  </Centered>
);

export function App() {
  const [chatClient, setChatClient] = useState<ChatClient>('discord');
  const { search, setSearch } = useSearch();
  const [isLockedLocally, lock] = useLock();
  const lockSocket = useLockSocket();
  const [
    favorites,
    addFavorite,
    removeFavorite,
    hasFavorite,
  ] = useFavorites();

  const {
    state: { sounds, upload },
    handlers: { playSound, fetchSounds, triggerUpload },
  } = useMuminstApi();

  useEffectOnce(() => {
    fetchSounds();
  });

  const onPlay = useCallback(
    (sound: Sound) => {
      playSound(chatClient, sound);
      lock();
    },
    [playSound, chatClient, lock]
  );

  const onPlayPreview = useCallback(
    (sound: Sound) => {
      playSound('browser', sound);
    },
    [playSound]
  );

  const isLocked = isLockedLocally || lockSocket.isLocked;

  const unfavorited = useMemo(() => {
    if (sounds.loading || sounds.error || !sounds.value) {
      return [];
    }

    return sounds.value.filter((sound) => !hasFavorite(sound));
  }, [sounds, hasFavorite]);

  const filtered = useMemo(() => {
    if (search === '') {
      return unfavorited;
    }

    return fuzzyFilter('name', unfavorited, search);
  }, [unfavorited, search]);

  return (
    <Centered sx={{ flexDirection: 'column' }}>
      <Grid
        gap={3}
        columns={['minmax(0, 1fr)', 'minmax(0, 1fr)']}
        padding={[3, 4]}
        paddingTop={5}
        sx={{ minWidth: '100%' }}>
        <Centered>
          <PageHeading>Muminst</PageHeading>
        </Centered>

        <FileDropzone uploadState={upload} onUpload={triggerUpload} />

        <Box>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            name="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </Box>

        <Box>
          <Label htmlFor="chat-client">Chat Client</Label>
          <Select
            id="chat-client"
            value={chatClient}
            onChange={(event) =>
              setChatClient(event.target.value as ChatClient)
            }>
            <option value="discord">Discord</option>
            <option value="telegram">Telegram</option>
            <option value="browser">Browser</option>
          </Select>
        </Box>

        {favorites.length > 0 && (
          <Box>
            <Heading as="h2">Favorites</Heading>
            <ButtonsSection>
              {favorites.map((sound) => (
                <InstantButton
                  isFavorite
                  key={sound.id}
                  sound={sound}
                  disabled={isLocked}
                  onClick={onPlay}
                  onFavorite={removeFavorite}
                  onPlayPreview={onPlayPreview}
                />
              ))}
            </ButtonsSection>
          </Box>
        )}

        <Box>
          <Heading as="h2">All</Heading>
          <ErrorBoundary
            fallback={FetchSoundsFailed}
            onReset={fetchSounds}>
            <AsyncResource state={sounds} fallback={<Loader />}>
              {(_allSounds) => {
                if (filtered.length === 0) {
                  return <Text>No results for "{search}"</Text>;
                }

                return (
                  <ButtonsSection>
                    {filtered.map((sound) => (
                      <InstantButton
                        key={sound.id}
                        sound={sound}
                        disabled={isLocked}
                        onClick={onPlay}
                        onFavorite={addFavorite}
                        onPlayPreview={onPlayPreview}
                      />
                    ))}
                  </ButtonsSection>
                );
              }}
            </AsyncResource>
          </ErrorBoundary>
        </Box>
      </Grid>

      <ErrorBoundary>
        <Recorder onUpload={triggerUpload} />
      </ErrorBoundary>
    </Centered>
  );
}
