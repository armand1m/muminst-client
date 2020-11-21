import React, { useState } from 'react';
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
import { useLock } from 'features/lock/useLock';
import { useSearch } from 'features/search/useSearch';
import { useFavorites } from 'features/favorites/useFavorites';
import {
  Sound,
  ChatClient,
  useMuminstApi,
} from 'features/api/useMuminstApi';
import { Recorder } from 'features/recording/Recorder';

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
  const [chatClient, setChatClient] = useState<ChatClient>('mumble');
  const { search, setSearch, matchSearch } = useSearch();
  const [isLocked, lock] = useLock();
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

  const onPlay = (sound: Sound) => {
    playSound(chatClient, sound);
    lock();
  };

  const onPlayPreview = (sound: Sound) => {
    playSound('browser', sound);
  };

  return (
    <Centered sx={{ flexDirection: 'column' }}>
      <Grid
        gap={3}
        columns={['minmax(0, 1fr)', 'minmax(0, 1fr)']}
        padding={[3, 4]}
        paddingTop={5}>
        <Centered>
          <PageHeading>Muminst</PageHeading>
        </Centered>

        <FileDropzone uploadState={upload} onUpload={triggerUpload} />

        <Box>
          <Label htmlFor="search">Search</Label>
          <Input
            id="search"
            value={search}
            onChange={(evt) => setSearch(evt.target.value)}
          />
        </Box>

        <Box>
          <Label htmlFor="chat-client">Chat Client</Label>
          <Select
            id="chat-client"
            value={chatClient}
            onChange={(evt) =>
              setChatClient(evt.target.value as ChatClient)
            }>
            <option value="mumble">Mumble</option>
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
              {(allSounds) => {
                const filtered = allSounds
                  .filter((sound) => !hasFavorite(sound))
                  .filter(matchSearch);

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
        <Recorder />
      </ErrorBoundary>
    </Centered>
  );
}
