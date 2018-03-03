import { readFileSync } from 'fs';

export class Constants {
	host: string;
}

let loadedConstants: Constants = undefined;

const loadedSecrets: { [key: string]: string } = {};

function getConstants(): Constants {
	if (!loadedConstants) {
		if (process.env.ENV === 'prod') {
			loadedConstants = require('../../constants.prod.json') as Constants;
		} else {
			loadedConstants = require('../../constants.dev.json') as Constants;
		}
	}
	return loadedConstants;
}

function getSecret(key: string): string {
	if (loadedSecrets[key] === undefined) {
		loadedSecrets[key] = readFileSync(`/run/secrets/${key}`).toString().trim();
	}
	return loadedSecrets[key];
}

export {
	getConstants,
	getSecret
};
