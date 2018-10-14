import { readFileSync } from "fs";
import { resolve } from "path";

export class Constants {
	public host: string;
}

let loadedConstants: Constants;
const loadedSecrets: { [key: string]: string } = {};

const projectDir = resolve(__dirname, "..", "..", "..");
const configDir = resolve(__dirname, "..", "config");

function isProd(): boolean {
	return process.env.NODE_ENV.indexOf("prod") >= 0;
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
			loadedSecrets[key] = readFileSync(`/run/secrets/${key}`).toString().trim();
		} else {
			loadedSecrets[key] = readFileSync(`${configDir}/secrets/${key}`).toString().trim();
		}
	}
	return loadedSecrets[key];
}

function getDevWebpackConfig() {
	return require(`${projectDir}/webpack.config.js`);
}

export {
	isProd,
	runningInDocker,
	getConstants,
	getSecret,
	getDevWebpackConfig,
};
