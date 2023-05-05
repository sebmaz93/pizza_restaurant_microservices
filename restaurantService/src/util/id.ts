// for Demonstration purposes not real random id generator
export const generateId = (): string => {
  return Math.random().toString(36).substring(2, 9);
};
