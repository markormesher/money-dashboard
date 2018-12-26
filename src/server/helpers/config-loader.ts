import { readFileSync } from "fs";
import { resolve } from "path";
import * as webpack from "webpack";

export class Constants {
	public env: string;
	public host: string;
}

let loadedConstants: Constants;
let loadedSecrets: { readonly [key: string]: string } = {};

const projectDir = resolve(__dirname, "..", "..", "..");
const configDir = resolve(__dirname, "..", "config");

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
	return process.env.RUNNING_IN === "docker";
}

function clearConstantsCache(): void {
	loadedConstants = undefined;
}

function getConstants(): Constants {
	if (!loadedConstants) {
		let configFile: string;
		if (isProd()) {
			configFile = `${configDir}/constants.prod.json`;
		} else {
			configFile = `${configDir}/constants.dev.json`;
		}
		loadedConstants = JSON.parse(readFileSync(configFile).toString().trim()) as Constants;
	}
	return loadedConstants;
}

function clearSecretsCache(): void {
	loadedSecrets = {};
}

function getSecret(key: string): string {
	if (loadedSecrets[key] === undefined) {
		if (runningInDocker()) {
			loadedSecrets = {
				...loadedSecrets,
				[key]: readFileSync(`/run/secrets/${key}`).toString().trim(),
			};
		} else {
			loadedSecrets = {
				...loadedSecrets,
				[key]: readFileSync(`${configDir}/secrets/${key}`).toString().trim(),
			};
		}
	}
	return loadedSecrets[key];
}

function getDevWebpackConfig(): webpack.Configuration {
	return require(`${projectDir}/webpack.config.js`);
}

export {
	isProd,
	isDev,
	isTest,
	runningInDocker,
	clearConstantsCache,
	getConstants,
	clearSecretsCache,
	getSecret,
	getDevWebpackConfig,
};
