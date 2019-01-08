function mapEntitiesFromApi<T>(mapper: (entity: T) => T, entities?: T[]): T[] {
	if (!entities && entities !== []) {
		return undefined;
	} else {
		return entities.map(mapper);
	}
}

export {
	mapEntitiesFromApi,
};
