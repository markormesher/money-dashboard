import * as fs from 'fs';

const loadedSecrets: { [key: string]: string } = {};

const getSecret: ((key: string) => string) = (key) => {
	if (loadedSecrets[key] === undefined) {
		loadedSecrets[key] = fs.readFileSync(`/run/secrets/${key}`).toString().trim();
	}
	return loadedSecrets[key];
};

export {getSecret};
