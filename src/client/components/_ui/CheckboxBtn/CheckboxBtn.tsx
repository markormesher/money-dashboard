import { faCheckSquare, faSquare } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { IconBtn } from "../IconBtn/IconBtn";

interface ICheckboxBtnProps {
	readonly text?: string;
	readonly checked?: boolean;
	readonly onChange?: (checked: boolean) => void;
	readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
}

class CheckboxBtn extends PureComponent<ICheckboxBtnProps> {

	constructor(props: ICheckboxBtnProps) {
		super(props);

		this.toggleChecked = this.toggleChecked.bind(this);
	}

	public render(): ReactNode {
		const { text, checked, btnProps } = this.props;
		const icon = checked ? faCheckSquare : faSquare;

		return (
				<IconBtn
						icon={icon}
						text={text}
						btnProps={{
							...btnProps,
							onClick: this.toggleChecked,
						}}
				/>
		);
	}

	private toggleChecked(): void {
		const { checked, onChange } = this.props;
		const newState = !checked;
		if (onChange) {
			onChange(newState);
		}
	}

}

export {
	CheckboxBtn,
};
