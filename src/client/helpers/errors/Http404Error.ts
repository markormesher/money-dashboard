import { DetailedError } from "./DetailedError";

export class Http404Error extends DetailedError {
	constructor() {
		super("Not Found", undefined, 404);
	}
}
