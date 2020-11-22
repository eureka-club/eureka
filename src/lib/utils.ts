export const asyncForEach = async (
  array: Array<unknown>,
  callback: (item: unknown, index: number, arr: Array<unknown>) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};
