import { faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import { Component } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import BootstrapFadeWrapper from "../BootstrapFadeWrapper/BootstrapFadeWrapper";
import IconBtn from "../IconBtn/IconBtn";

interface IModalProps {
	title: string;
	isOpen?: boolean;
	buttons?: Array<"cancel" | "save">;
	onCancel?: () => void;
	onSave?: () => void;
	onCloseRequest?: () => void;
}

class Modal extends Component<IModalProps> {

	public render() {
		const { title, buttons, isOpen, onCancel, onSave, onCloseRequest } = this.props;
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
									{buttons && buttons.length > 0 && <div className={bs.modalFooter}>
										{buttons.indexOf("cancel") >= 0 && <IconBtn
												icon={faTimes}
												text={"Cancel"}
												btnProps={{
													className: bs.btnOutlineDark,
													onClick: onCancel || onCloseRequest,
												}}
										/>}
										{buttons.indexOf("save") >= 0 && <IconBtn
												icon={faSave}
												text={"Save"}
												btnProps={{
													className: bs.btnSuccess,
													onClick: onSave,
												}}
										/>}
									</div>}
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
