import { faCircleNotch } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import { IRootState } from "../../../redux/root";
import * as styles from "./FullPageSpinner.scss";

interface IFullPageSpinnerProps {
	readonly waitingFor?: string[];
}

function mapStateToProps(state: IRootState, props: IFullPageSpinnerProps): IFullPageSpinnerProps {
	return {
		...props,
		waitingFor: state.global.waitingFor,
	};
}

class UCFullPageSpinner extends PureComponent<IFullPageSpinnerProps> {

	public render() {
		return (
				<div className={styles.spinnerWrapper}>
					<FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>
					<div className={styles.debugNotes}>
						Waiting for: {JSON.stringify(this.props.waitingFor)}
					</div>
				</div>
		);

	}
}

export const FullPageSpinner = connect(mapStateToProps)(UCFullPageSpinner);
