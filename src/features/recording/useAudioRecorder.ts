import { useRef, useState } from 'react';
import { useAsyncFn, useEffectOnce } from 'react-use';

const getUserMedia: MediaDevices['getUserMedia'] = async (
  constraints
) => {
  if (navigator?.mediaDevices?.getUserMedia) {
    return navigator.mediaDevices.getUserMedia(constraints);
  }

  return new Promise((resolve, reject) => {
    if (!constraints) {
      throw new Error('failed to load getUserMedia fallback.');
    }

    const getUserMedia: Navigator['getUserMedia'] =
      navigator.getUserMedia ??
      // @ts-ignore
      navigator.webkitGetUserMedia ??
      // @ts-ignore
      navigator.mozGetUserMedia;

    if (!getUserMedia) {
      return reject(
        new Error('getUserMedia is not implemented in this browser')
      );
    }

    getUserMedia.call(navigator, constraints, resolve, reject);
  });
};

export const useAudioRecorder = () => {
  const [audioUrl, setAudioUrl] = useState<string | undefined>(
    undefined
  );
  const [audioBlob, setAudioBlob] = useState<Blob | undefined>(
    undefined
  );
  const [isRecording, setIsRecording] = useState<boolean>(false);
  const chunks = useRef<Blob[]>([]);

  const reset = () => {
    chunks.current = [];
    setAudioUrl(undefined);
    setAudioBlob(undefined);
    setIsRecording(false);
  };

  const [recorderState, createRecorder] = useAsyncFn(async () => {
    const mimeType = 'audio/webm';
    const stream = await getUserMedia({ audio: true });
    const recorder = new MediaRecorder(stream, { mimeType });

    recorder.ondataavailable = function (event) {
      chunks.current.push(event.data);
    };

    recorder.onstart = function (_event) {
      setIsRecording(true);
    };

    recorder.onstop = function (_event) {
      const blob = new Blob(chunks.current, {
        type: mimeType,
      });

      chunks.current = [];
      setAudioBlob(blob);
      setAudioUrl(URL.createObjectURL(blob));
      setIsRecording(false);
    };

    return recorder;
  });

  useEffectOnce(() => {
    createRecorder();
  });

  if (recorderState.error) {
    console.error('useAudioRecorder error:', recorderState.error);
  }

  const result = {
    state: {
      url: audioUrl,
      blob: audioBlob,
      ready:
        !Boolean(recorderState.error || recorderState.loading) &&
        recorderState.value !== undefined,
      isRecording,
    },
    handlers: {
      reset,
      start: () => {
        recorderState.value?.start();
      },
      stop: () => {
        recorderState.value?.stop();
      },
    },
  };

  return result;
};
