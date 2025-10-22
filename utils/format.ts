export const formatToPercentage = (number: number) => {
  return `${Math.round(number * 10)}%`;
};

export const formatToHours = (number: number) => {
  const hours = Math.floor(number / 60);
  const minutes = number % 60;
  return `${hours}h ${minutes}m`;
};
export const formatToYear = (release: string) => {
  return release.split("-")[0];
};
