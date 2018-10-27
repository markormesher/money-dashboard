import * as React from "react";
import { DetailedError } from "./DetailedError";

class Http404Error extends DetailedError {
	constructor(path: string) {
		super("Not Found");
		this.httpStatus = 404;
		this.display = (
				<p>The path <code>{path}</code> could not be found.</p>
		);
	}
}

export {
	Http404Error,
};
