import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import * as bs from "../../bootstrap-aliases";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { combine } from "../../helpers/style-helpers";

interface IErrorPageProps {
	error: DetailedError;
	fullPage?: boolean;
}

class ErrorPage extends Component<IErrorPageProps> {

	public render() {
		const errorMessage = this.props.error.message || "Something went wrong";
		const errorDetail = this.props.error.detail;
		const errorDisplay = this.props.error.display;

		const wrapperClass = this.props.fullPage ? combine(bs.container, bs.pt5) : undefined;

		return (
				<div className={wrapperClass}>
					<h1 className={bs.h2}>
						<FontAwesomeIcon icon={faExclamationTriangle} className={combine(bs.mr2, bs.textMuted)}/>
						{errorMessage}
					</h1>

					{errorDetail && <p>{errorDetail}</p>}
					{errorDisplay}

					{/* The link is intentional implemented as <a> not <Link> to force reloading the page */}
					<p>You might want to try reloading the page, or <a href="/">going back to your dashboard</a>.</p>
				</div>
		);
	}
}

export default ErrorPage;
