import * as React from "react";
import { Component, ReactNode } from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

interface IBadgeProps {
	readonly className?: string;
	readonly marginRight?: boolean;
}

class Badge extends Component<IBadgeProps> {

	public render(): ReactNode {
		const { className, marginRight } = this.props;
		return (
				<span className={combine(bs.badge, className || bs.badgeLight, marginRight && bs.mr1)}>
					{this.props.children}
				</span>
		);
	}
}

export {
	Badge,
};
