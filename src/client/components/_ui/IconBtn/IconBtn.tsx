import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { FontAwesomeIcon, Props as FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import * as React from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";

interface IIconBtnProps {
	icon: IconProp;
	text: string;
	btnProps?: React.HTMLProps<HTMLButtonElement>;
	iconProps?: Partial<FontAwesomeIconProps>;
}

class IconBtn extends React.Component<IIconBtnProps> {

	public render() {
		const { icon, text, btnProps, iconProps } = this.props;
		const { className: btnClassName, ...otherBtnProps } = { ...btnProps };
		return (
				<button className={combine(bs.btn, btnClassName)} {...otherBtnProps}>
					<FontAwesomeIcon icon={icon} fixedWidth={true} className={bs.mr1} {...iconProps}/>
					{text}
				</button>
		);
	}
}

export default IconBtn;
