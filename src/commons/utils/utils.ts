function delayPromise(ms: number): Promise<void> {
  return new Promise((resolve): NodeJS.Timer => global.setTimeout(resolve, ms));
}

export { delayPromise };
