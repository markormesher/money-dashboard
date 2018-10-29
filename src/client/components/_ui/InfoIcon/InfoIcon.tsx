import { faInfoCircle } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";

interface IInfoIconPros {
	readonly hoverText: string;
}

class InfoIcon extends PureComponent<IInfoIconPros> {

	public render(): ReactNode {
		const { hoverText } = this.props;
		return (
				<span data-tooltip={hoverText}>
					<FontAwesomeIcon
							className={bs.textMuted}
							fixedWidth={true}
							icon={faInfoCircle}
					/>
				</span>
		);
	}
}

export {
	InfoIcon,
};
