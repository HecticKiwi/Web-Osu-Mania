import toWav from "audiobuffer-to-wav";

// Adds silence to the start of the audio blob, returning the result as a .wav blob
export async function addDelay(blob: Blob, duration: number) {
  const audioCtx = new AudioContext();

  const blobArrayBuffer = await blob.arrayBuffer();

  const audioBuffer = await audioCtx.decodeAudioData(blobArrayBuffer);

  const offlineCtx = new OfflineAudioContext(
    audioBuffer.numberOfChannels,
    audioBuffer.length,
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
