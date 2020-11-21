import React, { useState } from 'react';
import styled from '@emotion/styled';
import { useEffectOnce } from 'react-use';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import slugify from 'slugify';
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
import { RecordButton } from 'features/recording/RecordButton';
import { UploadRecordForm } from 'features/recording/UploadRecordForm';
import { useAudioRecorder } from 'features/recording/useAudioRecorder';
import {
  Sound,
  ChatClient,
  useMuminstApi,
} from 'features/api/useMuminstApi';

const ButtonsSection = styled(Flex)`
  flex-wrap: wrap;
  justify-content: center;
`;

const Loader = () => (
  <Centered>
    <Spinner />
  </Centered>
);

const FetchSoundsFailed: React.FC<FallbackProps> = ({
  resetErrorBoundary,
}) => (
  <Centered sx={{ flexDirection: 'column' }}>
    <Grid gap={2}>
      <Text>Failed to fetch sounds.</Text>
      <Button onClick={resetErrorBoundary}>Retry</Button>
    </Grid>
  </Centered>
);

export function App() {
  const [chatClient, setChatClient] = useState<ChatClient>('mumble');
  const { search, setSearch, matchSearch } = useSearch();
  const recorder = useAudioRecorder();
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
    <Centered>
      <Grid
        gap={3}
        columns={['minmax(0, 1fr)', 'minmax(0, 1fr)']}
        padding={[3, 4]}
        paddingTop={5}>
        <Centered>
          <PageHeading>Muminst</PageHeading>
        </Centered>

        <Centered sx={{ flexDirection: 'column' }}>
          {recorder.state.ready && (
            <RecordButton
              recording={recorder.state.isRecording}
              disabled={!recorder.state.ready}
              onClick={
                recorder.state.isRecording
                  ? recorder.handlers.stop
                  : recorder.handlers.start
              }>
              {recorder.state.isRecording ? 'Stop' : 'Start'}
            </RecordButton>
          )}

          {recorder.state.url !== undefined && (
            <Box padding={2}>
              <UploadRecordForm
                onSubmit={(values) => {
                  if (!recorder.state.blob) {
                    return;
                  }

                  const filename =
                    slugify(values.soundName) + '.webm';

                  const file = new File(
                    [recorder.state.blob],
                    filename,
                    {
                      type: 'audio/webm',
                    }
                  );

                  triggerUpload([file], (event) =>
                    console.log(event)
                  );
                  recorder.handlers.reset();
                }}
              />
            </Box>
          )}
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
            FallbackComponent={FetchSoundsFailed}
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
    </Centered>
  );
}
