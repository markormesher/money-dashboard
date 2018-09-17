import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import { DetailedError } from "../../helpers/errors/DetailedError";

import * as bs from "bootstrap/dist/css/bootstrap.css";
import * as styles from "./FullPageError.scss";

interface IFullPageErrorProps {
	error: Error;
}

class FullPageError extends Component<IFullPageErrorProps> {

	public render() {
		const errorMessage = this.props.error.message || "Something went wrong";
		const errorDescription = this.props.error instanceof DetailedError && this.props.error.description;

		return (
				<div className={styles.errorWrapper}>
					<h2>
						<FontAwesomeIcon icon={faExclamationTriangle} className={cn(bs.mr2, bs.textMuted)}/>
						{errorMessage}
					</h2>

					{errorDescription && <p>{errorDescription}</p>}

					<p>You might want to try reloading the page, or <a href="/">going back to your dashboard</a>.</p>
				</div>
		);

	}
}

export default FullPageError;
