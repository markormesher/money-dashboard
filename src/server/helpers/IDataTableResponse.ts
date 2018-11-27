// TODO: move to a sensible location as part of the refactoring (still within the server project)

interface IDataTableResponse<Model> {
	readonly filteredRowCount: number;
	readonly totalRowCount: number;
	readonly data: Model[];
}

export {
	IDataTableResponse,
};
