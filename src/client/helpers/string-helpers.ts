function capitaliseFirst(val: string): string {
	if (!val || val.length === 0) {
		return val;
	}

	return val.substr(0, 1).toUpperCase() + val.substr(1);
}

export {
	capitaliseFirst,
};
