import { existsSync } from "fs";

function isProd(): boolean {
  return process.env.NODE_ENV.toLowerCase() === "production";
}

function isDev(): boolean {
  return process.env.NODE_ENV.toLowerCase() === "development";
}

function isTest(): boolean {
  return process.env.NODE_ENV.toLowerCase() === "test";
}

function runningInDocker(): boolean {
  return existsSync("/.dockerenv");
}

export { runningInDocker, isTest, isDev, isProd };
