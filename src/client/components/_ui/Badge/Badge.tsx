import * as React from "react";
import { Component, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IBadgeProps {
	readonly key?: string;
	readonly className?: string;
	readonly marginRight?: boolean;
}

class Badge extends Component<IBadgeProps> {

	public render(): ReactNode {
		const { key, className, marginRight } = this.props;
		return (
				<span key={key} className={combine(bs.badge, className || bs.badgeLight, marginRight && bs.mr1)}>
					{this.props.children}
				</span>
		);
	}
}

export {
	Badge,
};
