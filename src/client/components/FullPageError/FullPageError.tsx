import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import { DetailedError } from "../../helpers/errors/DetailedError";
import * as styles from "./FullPageError.scss";

interface IFullPageErrorProps {
	error: Error;
}

class FullPageError extends Component<IFullPageErrorProps> {

	public render() {
		const errorMessage = this.props.error.message || "Something went wrong";
		const errorDescription = this.props.error instanceof DetailedError ? this.props.error.description : undefined;

		return (
				<div className={styles.errorWrapper}>
					<div>
						<h2>
							<FontAwesomeIcon icon={faExclamationTriangle}/>
							{errorMessage}
						</h2>
						{errorDescription ? <p>{errorDescription}</p> : undefined}
						<p>
							You might want to try reloading the page,
							or <a href="/">going back to your dashboard</a>.
						</p>
					</div>
				</div>
		);

	}
}

export default FullPageError;
