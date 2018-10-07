import * as React from "react";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import { IModalProps, Modal } from "../_ui/Modal/Modal";

interface IEditAccountModalProps {
	account: ThinAccount;
}

class EditAccountModal extends React.Component<IEditAccountModalProps & Partial<IModalProps>> {
	public render() {
		const { account, ...modalProps } = this.props;
		return (
				<Modal
						{...modalProps}
						title={"Edit Account"}>

					<pre>{JSON.stringify(account, null, 2)}</pre>

				</Modal>
		);
	}
}

export default EditAccountModal;
