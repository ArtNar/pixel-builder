export function createSingleton<T>(
  space: any,
  key: string,
  create: (key: string) => T
): T {
  const ns = Symbol.for(key);

  if (!Object.getOwnPropertySymbols(space).includes(ns)) {
    space[ns] = create(key);
  }

  return space[ns] as T;
}
