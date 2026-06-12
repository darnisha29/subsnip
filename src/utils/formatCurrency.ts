export const formatINR = (value: number): string =>
  `₹${value.toLocaleString("en-IN")}`;
