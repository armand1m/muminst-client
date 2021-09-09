import React, { useCallback, useMemo, useState } from 'react';
import styled from '@emotion/styled';
import { AxiosRequestConfig } from 'axios';
import { AsyncState } from 'react-use/lib/useAsync';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import { Button, Close, Flex, Grid, Progress, Text } from 'theme-ui';
import { UploadResponse } from 'features/api/useMuminstApi';
import { useFileUploadState } from 'features/upload/useFileUploadState';
import ReactTagInput from '@pathofdev/react-tag-input';

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
  text-align: center;
`;

interface Props {
  uploadState: AsyncState<UploadResponse>;
  onUpload: (
    files: File[],
    tags: string[],
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
  const [tags, setTags] = useState<string[]>([]);

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

  const _reset = () => {
    reset();
    setTags([]);
  };

  const hasFiles = useMemo(() => files.length > 0, [files]);

  return (
    <Grid gap={2}>
      <Container {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <Text>Drop the files here...</Text>
        ) : (
          <Text>
            Drag 'n' drop some files here or click to select files
          </Text>
        )}
      </Container>

      {hasFiles && (
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

      {hasFiles && <ReactTagInput tags={tags} onChange={setTags} />}

      {progress !== undefined && (
        <>
          <Progress max={1} value={progress} />
          <Text>{Math.trunc(progress * 100)}%</Text>
        </>
      )}

      {!uploadState.loading && uploadState.error !== undefined && (
        <Text color="red">
          Failed to upload files. Reason: {uploadState.error.message}
        </Text>
      )}

      {hasFiles && (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <Grid gap={2} columns={2}>
            <Button
              onClick={(_e) => {
                onUpload(files, tags, onUploadProgress);
              }}>
              Submit
            </Button>
            <Button onClick={_reset}>Reset</Button>
          </Grid>
        </Flex>
      )}
    </Grid>
  );
};
