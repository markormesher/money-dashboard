import * as React from "react";
import { Component, ReactElement } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import BootstrapFadeWrapper from "../BootstrapFadeWrapper/BootstrapFadeWrapper";
import ModalFooter from "./ModalFooter";

interface IModalProps {
	title: string;
	isOpen?: boolean;
	onCloseRequest?: () => void;
}

class Modal extends Component<IModalProps> {

	public render() {
		const { title, isOpen, onCloseRequest } = this.props;

		// TODO: come back to this logic later; it feels hacky and there is probably a better way to do it
		const children = React.Children.toArray(this.props.children);
		const bodyChildren = children.filter((child) => (child as ReactElement<any>).type !== ModalFooter);
		const footerChildren = children.filter((child) => (child as ReactElement<any>).type === ModalFooter);

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
										{bodyChildren}
									</div>
									<div className={bs.modalFooter}>
										{footerChildren}
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
