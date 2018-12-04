const NULL_UUID = "00000000-0000-0000-0000-000000000000";
const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function cleanUuid(uuid: string): string {
	if (!uuid || uuid.trim() === "") {
		return NULL_UUID;
	}

	if (!UUID_REGEX.test(uuid)) {
		throw new Error(`UUID was not valid: ${uuid}`);
	} else {
		return uuid;
	}
}

export {
	cleanUuid,
};
