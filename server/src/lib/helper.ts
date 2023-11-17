export function omitDoc<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keysToOmit: K[]
): Omit<T, K> {
  const result = obj._doc;

  keysToOmit.forEach((key) => {
    delete result[key];
  });

  return result;
}
