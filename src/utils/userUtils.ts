export const countPrimeDigits = (postalcode: number | string): number => {
  const primeDigits = new Set(["2", "3", "5", "7"]);
  return String(postalcode)
    .split("")
    .filter((char) => primeDigits.has(char)).length;
};
