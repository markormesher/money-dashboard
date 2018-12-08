import { readFileSync } from "fs";
import { resolve } from "path";
import * as webpack from "webpack";

export class Constants {
	public host: string;
}

let loadedConstants: Constants;
let loadedSecrets: { readonly [key: string]: string } = {};

const projectDir = resolve(__dirname, "..", "..", "..");
const configDir = resolve(__dirname, "..", "config");

const nodeEnv = process.env.NODE_ENV.toLowerCase();

function isProd(): boolean {
	return nodeEnv === "production";
}

function runningInDocker(): boolean {
	return process.env.RUNNING_IN === "docker";
}

function getConstants(): Constants {
	if (!loadedConstants) {
		if (isProd()) {
			loadedConstants = require(`${configDir}/constants.prod.json`) as Constants;
		} else {
			loadedConstants = require(`${configDir}/constants.dev.json`) as Constants;
		}
	}
	return loadedConstants;
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
	runningInDocker,
	getConstants,
	getSecret,
	getDevWebpackConfig,
};
