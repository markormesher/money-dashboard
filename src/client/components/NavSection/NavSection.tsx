import cn = require("classnames");
import * as React from "react";
import { Component } from "react";
import * as bs from "../../bootstrap-aliases";
import * as style from "./NavSection.scss";

interface INavSectionProps {
	title?: string;
}

export class NavSection extends Component<INavSectionProps> {
	private sectionHeaderClasses = cn(
			bs.alignItemsCenter, bs.justifyContentBetween,
			bs.dFlex, bs.px3, bs.mt4, bs.mb1,
			bs.textMuted, style.navSectionHeading,
	);
	private linkGroupClasses = cn(bs.nav, bs.flexColumn);

	public render() {

		return (
				<div>
					{this.props.title && (
							<h6 className={this.sectionHeaderClasses}>
								{this.props.title}
							</h6>
					)}

					<ul className={this.linkGroupClasses}>
						{this.props.children}
					</ul>
				</div>
		);
	}
}
