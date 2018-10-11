import { faCircleNotch, faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import IconBtn from "../IconBtn/IconBtn";
import * as styles from "./Modal.scss";

interface IModalProps {
	title: string;
	modalBusy?: boolean;
	onCloseRequest?: () => void;

	cancelBtnShown?: boolean;
	cancelBtnDisabled?: boolean;
	onCancel?: () => void;

	saveBtnShown?: boolean;
	saveBtnDisabled?: boolean;
	onSave?: () => void;
}

// TODO: fade into the page by adding to the view, THEN adding .show

class Modal extends Component<IModalProps> {

	public render() {
		const { title, modalBusy, onCloseRequest } = this.props;
		const { cancelBtnShown, cancelBtnDisabled, onCancel } = this.props;
		const { saveBtnShown, saveBtnDisabled, onSave } = this.props;
		return (
				<>
					<div className={combine(bs.modal, bs.fade, bs.dBlock, bs.show)}>
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

									{!modalBusy && cancelBtnShown !== false
									&& <IconBtn
											icon={faTimes}
											text={"Cancel"}
											btnProps={{
												className: bs.btnOutlineDark,
												onClick: onCancel || onCloseRequest,
												disabled: cancelBtnDisabled || modalBusy === true,
											}}
									/>}

									{!modalBusy && saveBtnShown !== false
									&& <IconBtn
											icon={faSave}
											text={"Save"}
											btnProps={{
												className: bs.btnSuccess,
												onClick: onSave,
												disabled: saveBtnDisabled || modalBusy === true,
											}}
									/>}
								</div>
							</div>
						</div>
					</div>

					<div className={combine(bs.modalBackdrop, bs.fade, bs.show)}/>
				</>
		);
	}
}

export {
	IModalProps,
	Modal,
};
