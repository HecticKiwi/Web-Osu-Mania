import toWav from "audiobuffer-to-wav";

// Adds silence to the start of the audio blob, returning the result as a .wav blob
// If blob arg is null, returns a silent .wav blob
export async function addDelay(blob: Blob | null, duration: number) {
  if (duration === 0) {
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
