import { faCircleNotch, faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import BootstrapFadeWrapper from "../BootstrapFadeWrapper/BootstrapFadeWrapper";
import IconBtn from "../IconBtn/IconBtn";
import * as styles from "./Modal.scss";

interface IModalProps {
	title: string;
	isOpen?: boolean;
	buttons?: Array<"cancel" | "save">;
	modalBusy?: boolean;
	onCancel?: () => void;
	onSave?: () => void;
	onCloseRequest?: () => void;
}

class Modal extends Component<IModalProps> {

	// TODO: show a spinner somewhere when the modal is busy

	public render() {
		const { title, buttons, modalBusy, isOpen, onCancel, onSave, onCloseRequest } = this.props;
		return (
				<>
					<BootstrapFadeWrapper in={isOpen}>
						<div className={combine(bs.modal, bs.fade, bs.dBlock)}>
							<div className={bs.modalDialog}>
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
										{modalBusy
										&& <FontAwesomeIcon icon={faCircleNotch} spin={true} size={"2x"}/>}

										{!modalBusy && buttons.indexOf("cancel") >= 0
										&& <IconBtn
												icon={faTimes}
												text={"Cancel"}
												btnProps={{
													className: bs.btnOutlineDark,
													onClick: onCancel || onCloseRequest,
													disabled: modalBusy === true,
												}}
										/>}

										{!modalBusy && buttons.indexOf("save") >= 0
										&& <IconBtn
												icon={faSave}
												text={"Save"}
												btnProps={{
													className: bs.btnSuccess,
													onClick: onSave,
													disabled: modalBusy === true,
												}}
										/>}
									</div>
								</div>
							</div>
						</div>
					</BootstrapFadeWrapper>

					<BootstrapFadeWrapper in={isOpen}>
						<div className={combine(bs.modalBackdrop, bs.fade)}/>
					</BootstrapFadeWrapper>
				</>
		);
	}
}

export {
	IModalProps,
	Modal,
};
