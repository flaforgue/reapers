import { Identifiable } from '../types';

export default <T extends Identifiable>(arr: T[], id: string): boolean => {
  return arr.some((elem) => elem.id === id);
};
