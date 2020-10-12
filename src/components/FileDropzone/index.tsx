import React, { useCallback, useState } from 'react';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import styled from '@emotion/styled';
import { Button, Close, Flex, Grid, Progress, Text } from 'theme-ui';
import { AxiosRequestConfig } from 'axios';

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

const Container = styled.div<DropzoneRootProps>`
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  border-width: 2px;
  border-radius: 2px;
  border-color: ${(props) => getColor(props)};
  border-style: dashed;
  background-color: #fafafa;
  color: #bdbdbd;
  outline: none;
  transition: border 0.24s ease-in-out;
  cursor: pointer;
`;

interface Props {
  onUpload: (
    files: File[],
    onUploadProgress: AxiosRequestConfig['onUploadProgress']
  ) => void;
}

export const FileDropzone: React.FC<Props> = ({ onUpload }) => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>();

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFiles(acceptedFiles);
    setProgress(undefined);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: 'audio/*',
    onDrop,
  });

  const removeFile = (file: File) => {
    const nextState = files.filter((f) => f.name !== file.name);
    setFiles(nextState);
  };

  const reset = () => {
    setFiles([]);
    setProgress(undefined);
  };

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
          {files.map((file) => (
            <Flex
              key={file.name}
              sx={{
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
              <Text>
                {file.name} - {Math.trunc(file.size / 1000)}kb
              </Text>
              <Close onClick={() => removeFile(file)} />
            </Flex>
          ))}

          {progress !== undefined && (
            <>
              <Progress max={1} value={progress} />
              <Text>{Math.trunc(progress * 100)}%</Text>
            </>
          )}

          {progress === 1 && <Text>Upload completed</Text>}
        </>
      )}

      {files.length > 0 && (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <Grid gap={2} columns={2}>
            <Button
              onClick={(_e) => {
                onUpload(files, (progressEvent) => {
                  setProgress(
                    progressEvent.loaded / progressEvent.total
                  );
                });
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
