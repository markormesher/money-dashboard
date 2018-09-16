export class DetailedError extends Error {
	public description?: string;
	public httpStatus?: number;

	constructor(message?: string, description?: string, httpStatus?: number) {
		super(message);
		this.description = description;
		this.httpStatus = httpStatus;
	}
}
