const isTest = process.env.NODE_ENV === 'test';

export const logger = {
  log: (...args: any[]) => {
    if (!isTest) {
      console.log(...args);
    }
  },
  error: (...args: any[]) => {
    if (!isTest) {
      console.error(...args);
    }
  }
}; 