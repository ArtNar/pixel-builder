export const secondsToDhms = (seconds: number) => {
  return {
    totalSeconds: seconds - 1,
    d: Math.floor(seconds / (3600 * 24)),
    h: Math.floor((seconds % (3600 * 24)) / 3600),
    m: Math.floor((seconds % 3600) / 60),
    s: Math.floor(seconds % 60),
  };
};
