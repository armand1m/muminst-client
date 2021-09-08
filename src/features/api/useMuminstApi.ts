import axios, { AxiosRequestConfig } from 'axios';
import { useAsyncFn } from 'react-use';

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

const baseURL = process.env.REACT_APP_API_URL;
const client = axios.create({ baseURL });

export const getSounds = () => client.get<Sound[]>('sounds');

export const playSound = (chatClient: ChatClient, sound: Sound) => {
  if (chatClient === 'browser') {
    const url = new URL(
      `/assets/${sound.fileName}${sound.extension}`,
      baseURL
    ).toString();
    const audio = new Audio(url);

    audio.addEventListener('canplaythrough', (_event) => {
      audio.play();
    });

    audio.addEventListener('ended', (_event) => {
      audio.pause();
    });
    return;
  }

  return client.post<void>('play-sound', {
    client: chatClient,
    soundId: sound.id,
  });
};

export const uploadFiles = async (
  files: File[],
  tags: string[] = [],
  onUploadProgress: AxiosRequestConfig['onUploadProgress']
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(file.name, file);
  });
  formData.append('tags', JSON.stringify(tags));

  return client.post<UploadResponse>('upload', formData, {
    onUploadProgress,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const addTags = async (sound: Sound, newTags: string[]) => {
  return client.put<Sound>(`/add-tags/${sound.id.toString()}`, {
    tags: newTags,
  });
};

export const useMuminstApi = () => {
  const [sounds, fetchSounds] = useAsyncFn(async () => {
    const { data } = await getSounds();
    return data;
  });

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
    []
  );

  return {
    state: {
      sounds,
      upload,
    },
    handlers: {
      fetchSounds,
      triggerUpload,
      playSound,
    },
  };
};
