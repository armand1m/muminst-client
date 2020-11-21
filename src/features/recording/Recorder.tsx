import React from 'react';
import { useMuminstApi } from 'features/api/useMuminstApi';
import { useAudioRecorder } from './useAudioRecorder';
import { Box, Grid, Heading } from 'theme-ui';
import { CenteredGrid } from 'components/CenteredGrid';
import slugify from 'slugify';
import { RecordButton } from './RecordButton';
import { UploadRecordForm } from './UploadRecordForm';

export const Recorder: React.FC = () => {
  const recorder = useAudioRecorder();
  const {
    // state: { upload },
    handlers: { triggerUpload },
  } = useMuminstApi();

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
              <Grid gap={2} padding={2}>
                {recorder.state.url && (
                  <audio src={recorder.state.url} controls={true} />
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

                    triggerUpload([file], (event) =>
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
