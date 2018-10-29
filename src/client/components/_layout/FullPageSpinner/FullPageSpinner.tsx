import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent } from "react";
import * as styles from "./FullPageSpinner.scss";

class FullPageSpinner extends PureComponent {

	public render() {
		return (
				<div className={styles.spinnerWrapper}>
					<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>
				</div>
		);
	}
}

export {
	FullPageSpinner,
};
