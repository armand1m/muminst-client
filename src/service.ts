import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL;

export type Sound = {
  name: string;
  id: string;
};

const client = axios.create({ baseURL });

export const getChannels = () => client.get('channels');
export const getSounds = () => client.get<Sound[]>('sounds');
export const playSound = (sound: Sound) =>
  client.post('play-sound', { soundId: sound.id });

export const uploadFiles = (files: File[]) => {
  const formData = new FormData();
  files.forEach((file) => {
    formData.append(file.name, file);
  });

  return client.post('upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};
