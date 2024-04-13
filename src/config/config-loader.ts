import { readFileSync } from "fs";

let loadedFileConfig: Readonly<Record<string, string>> = {};

function getFileConfig(path: string): string {
  if (loadedFileConfig[path] === undefined) {
    loadedFileConfig = {
      ...loadedFileConfig,
      [path]: readFileSync(path).toString().trim(),
    };
  }
  return loadedFileConfig[path];
}

function getEnvConfig(key: string, defaultValue?: string): string {
  if (process.env[key]) {
    return process.env[key].trim();
  } else {
    return defaultValue;
  }
}

export { getFileConfig, getEnvConfig };
