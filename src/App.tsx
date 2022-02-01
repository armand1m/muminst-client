import React, { useState, useCallback, useMemo } from 'react';
import styled from '@emotion/styled';
import { ErrorBoundary } from '@sentry/react';
import {
  Box,
  Button,
  Flex,
  Grid,
  Heading,
  Input,
  Label,
  Spinner,
  Text,
  Select,
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
  ApiMode,
} from 'features/api/useMuminstApi';
import Fuse from 'fuse.js';
import { NewTagsModal } from 'components/NewTagsModal';
import { ToggleApiModeButton } from 'components/ToggleApiModeButton';

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
  const [
    favorites,
    addFavorite,
    removeFavorite,
    hasFavorite,
  ] = useFavorites();
  const [modalIsOpen, setIsOpen] = useState(false);
  const [focusedSound, setFocusedSound] = useState<Sound>();

  const onAddTag = useCallback(
    (sound: Sound) => {
      setFocusedSound(sound);
      setIsOpen(true);
    },
    [setFocusedSound, setIsOpen]
  );

  const {
    state: { sounds, upload, apiMode },
    handlers: {
      playSound,
      fetchSounds,
      triggerUpload,
      addTags,
      toggleApiMode,
    },
  } = useMuminstApi();

  const lockSocket = useLockSocket(apiMode);

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

  // TODO: add support for isLocked in new rust server
  const isLocked =
    apiMode === ApiMode.Node &&
    (isLockedLocally || lockSocket.isLocked);

  const unfavorited = useMemo(() => {
    if (sounds.loading || sounds.error || !sounds.value) {
      return [];
    }

    return sounds.value.filter((sound) => !hasFavorite(sound));
  }, [sounds, hasFavorite]);

  const filtered = useMemo(() => {
    if (search === '') {
      return unfavorited.map((sound) => ({
        item: sound,
      }));
    }

    const searcher = new Fuse(unfavorited, {
      includeScore: true,
      keys: ['name', 'tags'],
    });

    return searcher.search(search);
  }, [unfavorited, search]);

  return (
    <>
      <ToggleApiModeButton
        checked={apiMode === ApiMode.Rust}
        onToggle={toggleApiMode}
      />
      <Centered sx={{ flexDirection: 'column' }}>
        <Grid
          gap={3}
          padding={[3, 4]}
          paddingTop={5}
          sx={{ minWidth: '100%' }}>
          <Centered>
            <PageHeading>Muminst</PageHeading>
          </Centered>

          <FileDropzone
            uploadState={upload}
            onUpload={triggerUpload}
          />

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
                    onAddTag={() => onAddTag(sound)}
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
                      {filtered.map(({ item }) => (
                        <InstantButton
                          key={item.id}
                          sound={item}
                          disabled={isLocked}
                          onClick={onPlay}
                          onFavorite={addFavorite}
                          onPlayPreview={onPlayPreview}
                          onAddTag={() => onAddTag(item)}
                        />
                      ))}
                    </ButtonsSection>
                  );
                }}
              </AsyncResource>
            </ErrorBoundary>
          </Box>
        </Grid>

        <NewTagsModal
          isOpen={modalIsOpen}
          onClose={() => setIsOpen(false)}
          sound={focusedSound}
          onSubmit={async (sound, tags) => {
            await addTags(sound, tags);
          }}
          onSuccess={() => {
            setIsOpen(false);
            fetchSounds();
          }}
        />

        <ErrorBoundary>
          <Recorder onUpload={triggerUpload} />
        </ErrorBoundary>
      </Centered>
    </>
  );
}
