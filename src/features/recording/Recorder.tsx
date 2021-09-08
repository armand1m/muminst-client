import React from 'react';
import { Box, Grid, Heading, Label } from 'theme-ui';
import styled from '@emotion/styled';
import slugify from 'slugify';
import { AxiosRequestConfig } from 'axios';
import { CenteredGrid } from 'components/CenteredGrid';
import { useAudioRecorder } from './useAudioRecorder';
import { RecordButton } from './RecordButton';
import { UploadRecordForm } from './UploadRecordForm';

const Audio = styled.audio`
  height: 42px;
  outline: none !important;

  &::-webkit-media-controls-enclosure {
    background: white;
    border-radius: 4px;
    max-height: 42px;
  }
`;

interface Props {
  onUpload: (
    files: File[],
    tags: string[],
    onUploadProgress: AxiosRequestConfig['onUploadProgress']
  ) => void;
}

export const Recorder: React.FC<Props> = ({ onUpload }) => {
  const recorder = useAudioRecorder();

  return (
    <>
      {recorder.state.ready && !recorder.state.error && (
        <Box
          sx={{
            position: 'sticky',
            width: '100%',
            padding: 20,
            zIndex: 2,
            bottom: 0,
            backgroundColor: 'secondary',
          }}>
          <CenteredGrid>
            <Heading color="red">
              {recorder.state.isRecording
                ? 'Recording..'
                : 'Recorder'}
            </Heading>

            {recorder.state.ready && (
              <RecordButton
                recording={recorder.state.isRecording}
                disabled={!recorder.state.ready}
                onClick={
                  recorder.state.isRecording
                    ? recorder.handlers.stop
                    : recorder.handlers.start
                }
              />
            )}

            {recorder.state.blob && (
              <Grid gap={2} padding={2} sx={{ maxWidth: 315 }}>
                {recorder.state.url && (
                  <Box>
                    <Label>Sound</Label>
                    <Audio controls src={recorder.state.url} />
                  </Box>
                )}

                <UploadRecordForm
                  onReset={() => {
                    recorder.handlers.reset();
                  }}
                  onSubmit={(values) => {
                    if (!recorder.state.blob) {
                      return;
                    }

                    const filename = `${slugify(
                      values.soundName
                    )}.webm`;

                    const file = new File(
                      [recorder.state.blob],
                      filename,
                      {
                        type: 'audio/webm',
                      }
                    );

                    onUpload([file], values.tags, (event) =>
                      console.log(event)
                    );
                    recorder.handlers.reset();
                  }}
                />
              </Grid>
            )}
          </CenteredGrid>
        </Box>
      )}
    </>
  );
};
