import { IconProp } from "@fortawesome/fontawesome-svg-core";
import { faCircleNotch, faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { PureComponent, ReactElement, ReactNode } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import { IconBtn } from "../IconBtn/IconBtn";
import * as styles from "./Modal.scss";

enum ModalBtnType {
	SAVE = "save",
	CANCEL = "cancel",
}

interface IModalBtn {
	readonly type: ModalBtnType;
	readonly disabled?: boolean;
	readonly onClick?: () => void;
}

interface IModalProps {
	readonly title: string;
	readonly buttons?: IModalBtn[];
	readonly modalBusy?: boolean;
	readonly onCloseRequest?: () => void;
}

// TODO: fade into the page by adding to the view, THEN adding .show

class Modal extends PureComponent<IModalProps> {

	public render(): ReactNode {
		const { title, buttons, modalBusy, onCloseRequest } = this.props;
		return (
				<>
					<div className={combine(bs.modal, bs.fade, bs.dBlock, bs.show)}>
						<div className={combine(bs.modalDialog, styles.modalDialog)}>
							<div className={bs.modalContent}>
								<div className={bs.modalHeader}>
									<h5 className={bs.modalTitle}>{title}</h5>
									<button className={bs.close} onClick={onCloseRequest}>
										<span aria-hidden="true">&times;</span>
									</button>
								</div>
								<div className={bs.modalBody}>
									{this.props.children}
								</div>
								<div className={combine(bs.modalFooter, styles.modalFooter)}>
									{modalBusy && <FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>}
									{!modalBusy && buttons.map(this.renderBtn)}
								</div>
							</div>
						</div>
					</div>

					<div className={combine(bs.modalBackdrop, bs.fade, bs.show)}/>
				</>
		);
	}

	private renderBtn(btn: IModalBtn): ReactElement<void> {
		let icon: IconProp;
		let label: string;
		let className: string;
		switch (btn.type) {
			case ModalBtnType.SAVE:
				icon = faSave;
				label = "Save";
				className = bs.btnSuccess;
				break;

			case ModalBtnType.CANCEL:
				icon = faTimes;
				label = "Cancel";
				className = bs.btnOutlineDark;
				break;
		}
		return (
				<IconBtn
						icon={icon}
						text={label}
						btnProps={{
							className,
							onClick: btn.onClick,
							disabled: btn.disabled,
						}}
				/>
		);
	}
}

export {
	IModalProps,
	IModalBtn,
	Modal,
	ModalBtnType,
};
