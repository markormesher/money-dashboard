import * as React from "react";
import { IModalProps, Modal } from "../_ui/Modal/Modal";

interface IEditAccountModalProps {
	accountId: string;
}

class EditAccountModal extends React.Component<IEditAccountModalProps & Partial<IModalProps>> {
	public render() {
		const { accountId, ...modalProps } = this.props;
		return (
				<Modal
						{...modalProps}
						title={"Edit Account"}>

					<p>{accountId}</p>

				</Modal>
		);
	}
}

export default EditAccountModal;
