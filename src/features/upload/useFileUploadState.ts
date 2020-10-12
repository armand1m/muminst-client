import { useState } from 'react';

export const useFileUploadState = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [progress, setProgress] = useState<number>();

  const removeFile = (file: File) => {
    const nextState = files.filter((f) => f.name !== file.name);
    if (nextState.length === 0) {
      setProgress(undefined);
    }
    setFiles(nextState);
  };

  const reset = () => {
    setFiles([]);
    setProgress(undefined);
  };

  const onUploadProgress = (progressEvent: ProgressEvent) => {
    setProgress(progressEvent.loaded / progressEvent.total);
  };

  return {
    files,
    setFiles,
    progress,
    setProgress,
    onUploadProgress,
    reset,
    removeFile,
  };
};
