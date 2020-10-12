import React, { useCallback } from 'react';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import styled from '@emotion/styled';
import { Button, Close, Flex, Grid, Progress, Text } from 'theme-ui';
import { AxiosRequestConfig } from 'axios';
import { useFileUploadState } from 'features/upload/useFileUploadState';
import { AsyncState } from 'react-use/lib/useAsync';
import { UploadResponse } from 'features/api/useMuminstApi';

const getColor = (props: DropzoneRootProps) => {
  if (props.isDragAccept) {
    return '#00e676';
  }
  if (props.isDragReject) {
    return '#ff1744';
  }
  if (props.isDragActive) {
    return '#2196f3';
  }
  return '#eeeeee';
};

const Container = styled(Flex)<DropzoneRootProps>`
  flex: 1;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${getColor};
  border-style: dashed;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`;

interface Props {
  uploadState: AsyncState<UploadResponse>;
  onUpload: (
    files: File[],
    onUploadProgress: AxiosRequestConfig['onUploadProgress']
  ) => void;
}

export const FileDropzone: React.FC<Props> = ({
  uploadState,
  onUpload,
}) => {
  const {
    files,
    progress,
    setFiles,
    setProgress,
    onUploadProgress,
    reset,
    removeFile,
  } = useFileUploadState();

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFiles(acceptedFiles);
      setProgress(undefined);
    },
    [setFiles, setProgress]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'audio/*',
    onDrop,
  });

  return (
    <Grid gap="12px">
      <Container {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the files here...</Text>
        ) : (
          <Text>
            Drag 'n' drop some files here, or click to select files
          </Text>
        )}
      </Container>

      {files.length > 0 && (
        <>
          {files.map((file) => {
            const success = uploadState.value?.successful.find(
              (f) => f.filename === file.name
            );
            const error = uploadState.value?.failed.find(
              (f) => f.filename === file.name
            );

            const fileInfo = `${file.name} - ${Math.trunc(
              file.size / 1000
            )}kb`;
            let text = <Text>{fileInfo}</Text>;

            if (error) {
              text = (
                <Text color="red">
                  {fileInfo}: {error.reason}
                </Text>
              );
            }

            if (success) {
              text = <Text color="green">{fileInfo}: Success</Text>;
            }

            return (
              <Flex
                key={file.name}
                sx={{
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                {text}
                <Close onClick={() => removeFile(file)} />
              </Flex>
            );
          })}
        </>
      )}

      {progress !== undefined && (
        <>
          <Progress max={1} value={progress} />
          <Text>{Math.trunc(progress * 100)}%</Text>
        </>
      )}

      {progress === 1 && <Text>Upload completed</Text>}

      {files.length > 0 && (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <Grid gap={2} columns={2}>
            <Button
              onClick={(_e) => {
                onUpload(files, onUploadProgress);
              }}>
              Submit
            </Button>
            <Button onClick={reset}>Reset</Button>
          </Grid>
        </Flex>
      )}
    </Grid>
  );
};
