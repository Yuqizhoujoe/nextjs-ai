export const mapCountryCode = () => {};

export const formatName = (voiceName: string) => {
  const index = voiceName.indexOf("Neural");
  return voiceName.slice(6, index);
};
