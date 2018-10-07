import { faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import * as React from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import IconBtn from "../IconBtn/IconBtn";

interface IModalProps {
	title: string;
	isOpen?: boolean;
	onCloseRequest?: () => void;
}

class Modal extends React.Component<IModalProps> {
	public render() {
		const { title, isOpen, onCloseRequest } = this.props;

		return (
				<div className={combine(bs.modal, isOpen && bs.dBlock)}>
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
							<div className={bs.modalFooter}>
								<IconBtn icon={faTimes} text={"Cancel"} btnProps={{ className: bs.btnOutlineDark }}/>
								<IconBtn icon={faSave} text={"Save"} btnProps={{ className: bs.btnSuccess }}/>
							</div>
						</div>
					</div>
				</div>
		);
	}
}

export {
	IModalProps,
	Modal,
};
