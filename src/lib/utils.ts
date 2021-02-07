import dayjs from 'dayjs';
import advancedFormat from 'dayjs/plugin/advancedFormat';
import isBetween from 'dayjs/plugin/isBetween';

export const advancedDayjs = (date: string | number | Date): dayjs.Dayjs => {
  dayjs.extend(advancedFormat);
  dayjs.extend(isBetween);

  return dayjs(date);
};

export const asyncForEach = async (
  array: Array<unknown>,
  callback: (item: unknown, index: number, arr: Array<unknown>) => Promise<void>,
): Promise<void> => {
  for (let index = 0; index < array.length; index += 1) {
    await callback(array[index], index, array); // eslint-disable-line no-await-in-loop
  }
};
