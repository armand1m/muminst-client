import React from 'react';
import { useDropzone, DropzoneRootProps } from 'react-dropzone';
import styled from '@emotion/styled';
import { Button, Flex, Grid } from 'theme-ui';

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
`;

interface Props {
  onUpload: (files: File[]) => void;
}

export const FileDropzone: React.FC<Props> = ({ onUpload }) => {
  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
  } = useDropzone({
    accept: 'audio/*',
  });

  return (
    <Grid gap="12px">
      <Container {...getRootProps()}>
        <input {...getInputProps()} />
        {isDragActive ? (
          <p>Drop the files here ...</p>
        ) : (
          <p>
            Drag 'n' drop some files here, or click to select files
          </p>
        )}
      </Container>

      {acceptedFiles.map((file) => (
        <li key={file.name}>
          {file.name} - {file.size} bytes
        </li>
      ))}

      {acceptedFiles.length > 0 && (
        <Flex sx={{ justifyContent: 'flex-end' }}>
          <Button
            onClick={(e) => {
              onUpload(acceptedFiles);
            }}>
            Upload
          </Button>
        </Flex>
      )}
    </Grid>
  );
};
