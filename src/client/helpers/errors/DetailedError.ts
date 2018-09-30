import { ReactNode } from "react";

export class DetailedError extends Error {
	public detail?: string;
	public display?: ReactNode;
	public httpStatus?: number;

	constructor(message?: string, detail?: string, display?: ReactNode, httpStatus?: number) {
		super(message);
		this.detail = detail;
		this.display = display;
		this.httpStatus = httpStatus;
	}
}
