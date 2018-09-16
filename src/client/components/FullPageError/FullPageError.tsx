import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import * as styles from "./FullPageError.scss";

interface IFullPageErrorProps {
	message: string;
}

class FullPageError extends Component<IFullPageErrorProps> {

	public render() {
		return (
				<div className={styles.errorWrapper}>
					<FontAwesomeIcon icon={faExclamationTriangle} size={"2x"}/>
					<h2>{this.props.message}</h2>
				</div>
		);

	}
}

export default FullPageError;
