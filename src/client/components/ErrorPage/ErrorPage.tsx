import { faExclamationTriangle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { DetailedError } from "../../helpers/errors/DetailedError";
import { combine } from "../../helpers/style-helpers";

interface IErrorPageProps {
	readonly error: DetailedError;
	readonly fullPage?: boolean;
}

class ErrorPage extends PureComponent<IErrorPageProps> {

	public render(): ReactNode {
		const errorMessage = this.props.error.message || "Something went wrong";
		const errorDisplay = this.props.error.display;

		const wrapperClass = this.props.fullPage ? combine(bs.container, bs.pt5) : undefined;

		return (
				<div className={wrapperClass}>
					<h1 className={bs.h2}>
						<FontAwesomeIcon icon={faExclamationTriangle} className={combine(bs.mr2, bs.textMuted)}/>
						{errorMessage}
					</h1>

					{typeof errorDisplay === typeof "" ? (<p>{errorDisplay}</p>) : errorDisplay}

					{/* The link is intentional implemented as <a> rather than <Link> to force reloading the page */}
					<p>You might want to try reloading the page, or <a href="/">going back to your dashboard</a>.</p>
				</div>
		);
	}
}

export {
	ErrorPage,
};
