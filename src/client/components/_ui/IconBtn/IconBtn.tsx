import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import * as React from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IIconBtnProps<Payload> {
	icon: IconProp;
	text: string;
	btnProps?: React.HTMLProps<HTMLButtonElement>;
	iconProps?: Partial<FontAwesomeIconProps>;
	onClick?: (payload: Payload) => void;
	payload?: Payload;
}

class IconBtn<Payload> extends Component<IIconBtnProps<Payload>> {

	constructor(props: IIconBtnProps<Payload>) {
		super(props);
		this.handleClick = this.handleClick.bind(this);
	}

	public render() {
		const { icon, text, btnProps, iconProps } = this.props;
		const { className: btnClassName, ...otherBtnProps } = { ...btnProps };
		return (
				<button
						className={combine(bs.btn, btnClassName)}
						onClick={this.handleClick}
						{...otherBtnProps}
				>
					<FontAwesomeIcon icon={icon} fixedWidth={true} className={bs.mr1} {...iconProps}/>
					{text}
				</button>
		);
	}

	private handleClick() {
		const { onClick, payload } = this.props;
		if (onClick) {
			onClick(payload);
		}
	}
}

export default IconBtn;
