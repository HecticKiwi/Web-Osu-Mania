export function mean(arr: number[]) {
  return arr.reduce((a, b) => a + b, 0) / arr.length;
}

export function stdev(arr: number[]) {
  const meanValue = mean(arr);
  return Math.sqrt(
    arr.reduce((a, b) => a + (b - meanValue) ** 2, 0) / arr.length,
  );
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export function roundToPrecision(value: number, precision: number) {
  const magnitude = 10 ** precision;
  return Math.round((value + Number.EPSILON) * magnitude) / magnitude;
}
