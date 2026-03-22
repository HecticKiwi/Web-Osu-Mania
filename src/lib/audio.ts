import {
  AUDIO_PREVIEW_PROVIDERS,
  useSettingsStore,
} from "@/stores/settingsStore";
import toWav from "audiobuffer-to-wav";
import { toast } from "sonner";

// Adds silence to the start and/or end of the audio blob, returning the result as a .wav blob
// If blob arg is null, returns a silent .wav blob
export async function addDelay(
  blob: Blob | null,
  beforeDuration: number, // Silence to add before song, in seconds
  totalDuration: number, // Total duration target, in seconds
) {
  const audioCtx = new AudioContext();

  let audioBuffer: AudioBuffer;
  if (blob) {
    const blobArrayBuffer = await blob.arrayBuffer();

    audioBuffer = await audioCtx.decodeAudioData(blobArrayBuffer);
  } else {
    const sampleRate = 44100;

    audioBuffer = audioCtx.createBuffer(
      2,
      sampleRate * totalDuration,
      sampleRate,
    );
  }

  const duration = audioBuffer.length / audioBuffer.sampleRate;
  if (blob && beforeDuration === 0 && duration >= totalDuration) {
    return blob;
  }

  const totalLength = totalDuration * audioBuffer.sampleRate;

  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    totalLength,
    audioBuffer.sampleRate,
  );

  const source = new AudioBufferSourceNode(offlineCtx, {
    buffer: audioBuffer,
  });

  source.connect(offlineCtx.destination);
  source.start(beforeDuration);

  const renderedBuffer = await offlineCtx.startRendering();

  const wav = toWav(renderedBuffer);
  const newBlob = new Blob([wav], { type: "audio/wav" });

  return newBlob;
}

export function playAudioPreview(beatmapSetId: number, volume: number) {
  const { audioPreviewProvider, customAudioPreviewProvider } =
    useSettingsStore.getState();

  const audioUrl = (
    audioPreviewProvider !== "Custom"
      ? AUDIO_PREVIEW_PROVIDERS[audioPreviewProvider]
      : customAudioPreviewProvider
  ).replace("$setId", beatmapSetId.toString());

  const audio = new Howl({
    src: [audioUrl],
    format: "mp3",
    html5: true, // To prevent XHR errors
    autoplay: true,
    volume: 0,
    onplay: () => {
      audio.fade(0, volume, 500);
    },
    onloaderror: () => {
      toast.message("Audio preview could not be loaded.", {
        description:
          "Try switching to another audio preview provider in the settings.",
      });
    },
  });

  return audio;
}

export function stopAudioPreview(audio: Howl) {
  audio.fade(audio.volume(), 0, 500);

  setTimeout(() => {
    audio.unload();
  }, 500);
}
