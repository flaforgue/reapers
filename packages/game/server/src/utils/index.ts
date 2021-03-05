import Identifiable from '../core/shared/identifiable';

const hrtimeMs = (): number => {
  const time = process.hrtime();
  return time[0] * 1000 + time[1] / 1000000;
};

const removeFromArrayById = <T extends Identifiable>(arr: T[], id: string): T | undefined => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
};

export { hrtimeMs, removeFromArrayById };
