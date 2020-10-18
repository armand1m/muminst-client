import axios, { AxiosRequestConfig } from 'axios';
import { useAsyncFn } from 'react-use';

export type ChatClient =
  | 'discord'
  | 'mumble'
  | 'telegram'
  | 'browser';

export interface MumbleChannel {
  children: object;
  links: object;
  id: number;
  name: string;
  position: number;
  parent?: MumbleChannel;
}

export interface Sound {
  name: string;
  id: string;
  fileName: string;
  extension: '.mp3' | '.wav';
}

export interface FailedUploadResponse {
  reason: string;
  filename: string;
}

export interface SuccessfulUploadResponse {
  id: string;
  filename: string;
}

export interface UploadResponse {
  failed: FailedUploadResponse[];
  successful: SuccessfulUploadResponse[];
}

const baseURL = process.env.REACT_APP_API_URL;
const client = axios.create({ baseURL });

export const getChannels = () =>
  client.get<MumbleChannel[]>('channels');

export const getSounds = () => client.get<Sound[]>('sounds');

export const playSound = (chatClient: ChatClient, sound: Sound) => {
  if (chatClient === 'browser') {
    const url = new URL(
      `/assets/${sound.fileName}${sound.extension}`,
      baseURL
    ).toString();
    const audio = new Audio(url);

    audio.addEventListener('canplaythrough', (event) => {
      audio.play();
    });

    audio.addEventListener('ended', (event) => {
      audio.pause();
    });
    return;
  }

  return client.post<void>('play-sound', {
    client: chatClient,
    soundId: sound.id,
  });
};

export const uploadFiles = (
  files: File[],
  onUploadProgress: AxiosRequestConfig['onUploadProgress']
) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(file.name, file);
  });

  return client.post<UploadResponse>('upload', formData, {
    onUploadProgress,
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const useMuminstApi = () => {
  const [channels, fetchChannels] = useAsyncFn(async () => {
    const { data } = await getChannels();
    return data;
  });

  const [sounds, fetchSounds] = useAsyncFn(async () => {
    const { data } = await getSounds();
    return data;
  });

  const [upload, triggerUpload] = useAsyncFn(
    async (
      files: File[],
      onUploadProgress: AxiosRequestConfig['onUploadProgress']
    ) => {
      const { data } = await uploadFiles(files, onUploadProgress);

      /**
       * Only refetch sounds if there
       * are successful uploads
       */
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
      channels,
      upload,
    },
    handlers: {
      fetchSounds,
      fetchChannels,
      triggerUpload,
      playSound,
    },
  };
};
