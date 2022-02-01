import axios, { AxiosRequestConfig } from 'axios';
import { useCallback, useEffect, useMemo } from 'react';
import { useAsyncFn, useToggle } from 'react-use';

export type ChatClient = 'discord' | 'telegram' | 'browser';

export interface Sound {
  name: string;
  id: string;
  fileName: string;
  extension: '.mp3' | '.wav' | '.webm';
  tags: string[];
}

export interface FailedUploadResponse {
  reason: string;
  filename: string;
}

export interface SuccessfulUploadResponse {
  id: string;
  filename: string;
  tags: string[];
}

export interface UploadResponse {
  failed: FailedUploadResponse[];
  successful: SuccessfulUploadResponse[];
}

export enum ApiMode {
  Rust = 'rust',
  Node = 'node',
}

export const getApiUrl = (apiMode: ApiMode) => {
  const apiUrl =
    apiMode === ApiMode.Rust
      ? process.env.REACT_APP_RUST_API_URL
      : process.env.REACT_APP_NODE_API_URL;

  return apiUrl;
};

const playAudioFromUrl = (url: URL) => {
  const audio = new Audio(url.toString());

  audio.addEventListener('canplaythrough', (_event) => {
    audio.play();
  });

  audio.addEventListener('ended', (_event) => {
    audio.pause();
  });
};

const useClient = () => {
  const [isRustApiEnabled, toggleRustMode] = useToggle(false);
  const apiMode = isRustApiEnabled ? ApiMode.Rust : ApiMode.Node;
  const baseURL = getApiUrl(apiMode);
  const axiosClient = useMemo(() => axios.create({ baseURL }), [
    baseURL,
  ]);

  const getSounds = useCallback(
    () => axiosClient.get<Sound[]>('sounds'),
    [axiosClient]
  );

  const playSound = useCallback(
    async (chatClient: ChatClient, sound: Sound) => {
      if (chatClient === 'browser') {
        const url = new URL(
          `/assets/${sound.fileName}${sound.extension}`,
          baseURL
        );
        playAudioFromUrl(url);
        return;
      }

      return axiosClient.post<void>('play-sound', {
        client: chatClient,
        soundId: sound.id,
      });
    },
    [axiosClient, baseURL]
  );

  const uploadFiles = useCallback(
    async (
      files: File[],
      tags: string[],
      onUploadProgress: AxiosRequestConfig['onUploadProgress']
    ) => {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append(file.name, file);
      });
      formData.append('tags', JSON.stringify(tags));

      return axiosClient.post<UploadResponse>('upload', formData, {
        onUploadProgress,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    },
    [axiosClient]
  );

  const addTags = useCallback(
    async (sound: Sound, newTags: string[]) => {
      return axiosClient.put<Sound>(
        `/add-tags/${sound.id.toString()}`,
        {
          tags: newTags,
        }
      );
    },
    [axiosClient]
  );

  return {
    getSounds,
    playSound,
    uploadFiles,
    addTags,
    toggleApiMode: toggleRustMode,
    apiMode,
  };
};

export const useMuminstApi = () => {
  const {
    getSounds,
    playSound,
    uploadFiles,
    addTags,
    apiMode,
    toggleApiMode,
  } = useClient();

  const [sounds, fetchSounds] = useAsyncFn(async () => {
    const { data } = await getSounds();
    return data;
  }, [getSounds]);

  const [upload, triggerUpload] = useAsyncFn(
    async (
      files: File[],
      tags: string[],
      onUploadProgress: AxiosRequestConfig['onUploadProgress']
    ) => {
      const { data } = await uploadFiles(
        files,
        tags,
        onUploadProgress
      );

      if (data.successful.length > 0) {
        fetchSounds();
      }

      return data;
    },
    [uploadFiles, fetchSounds]
  );

  useEffect(() => {
    fetchSounds();
  }, [apiMode, fetchSounds]);

  return {
    state: {
      sounds,
      upload,
      apiMode,
    },
    handlers: {
      fetchSounds,
      triggerUpload,
      playSound,
      addTags,
      toggleApiMode,
    },
  };
};
