import toWav from "audiobuffer-to-wav";

// Adds silence to the start of the audio blob, returning the result as a .wav blob
// If blob arg is null, returns a silent .wav blob
export async function addDelay(blob: Blob | null, duration: number) {
  if (blob && duration === 0) {
    return blob;
  }

  const audioCtx = new AudioContext();

  let audioBuffer: AudioBuffer;
  if (blob) {
    const blobArrayBuffer = await blob.arrayBuffer();

    audioBuffer = await audioCtx.decodeAudioData(blobArrayBuffer);
  } else {
    const sampleRate = 44100;

    audioBuffer = audioCtx.createBuffer(2, sampleRate * duration, sampleRate);
  }

  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length + duration * audioBuffer.sampleRate,
    audioBuffer.sampleRate,
  );

  const source = new AudioBufferSourceNode(offlineCtx, {
    buffer: audioBuffer,
  });

  source.connect(offlineCtx.destination);

  source.start(offlineCtx.currentTime + duration);

  const renderedBuffer = await offlineCtx.startRendering();

  const wav = toWav(renderedBuffer);
  const newBlob = new Blob([wav]);

  return newBlob;
}

export function playAudioPreview(beatmapSetId: number, volume: number) {
  const audio = new Howl({
    src: [`https://b.ppy.sh/preview/${beatmapSetId}.mp3`],
    format: "mp3",
    html5: true, // To prevent XHR errors
    autoplay: true,
    volume: 0,
    onplay: () => {
      audio.fade(0, volume, 500);
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
