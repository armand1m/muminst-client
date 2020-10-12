import axios from 'axios';
import { useAsyncFn } from 'react-use';

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

export const playSound = (sound: Sound) =>
  client.post<void>('play-sound', { soundId: sound.id });

export const uploadFiles = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(file.name, file);
  });

  return client.post<UploadResponse>('upload', formData, {
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
    async (files: File[]) => {
      const response = await uploadFiles(files);

      if (response.data.failed.length) {
        alert(
          `${response.data.failed
            .map((err) => err.reason)
            .join(', ')}`
        );
      }

      fetchSounds();

      return response.data;
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
