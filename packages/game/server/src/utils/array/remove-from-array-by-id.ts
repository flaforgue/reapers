import { Identifiable } from '../types';

export default <T extends Identifiable>(arr: T[], id: string): T | undefined => {
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].id === id) {
      return arr.splice(i, 1)[0];
    }
  }
};
