export const logWithTime = (msg: string) => {
  console.log(`-- ${new Date(Date.now()).toLocaleTimeString()} ${msg}`);
};
