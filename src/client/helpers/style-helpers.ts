function combine(...classNames: Array<string | boolean | undefined>) {
	// concat all string items
	return classNames.filter((cn) => typeof cn === typeof "").join(" ");
}

export {
	combine,
};
