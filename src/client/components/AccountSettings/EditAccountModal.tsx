import { faSave, faTimes } from "@fortawesome/pro-light-svg-icons";
import { Component } from "react";
import * as React from "react";
import { ThinAccount } from "../../../server/model-thins/ThinAccount";
import * as bs from "../../bootstrap-aliases";
import IconBtn from "../_ui/IconBtn/IconBtn";
import { IModalProps, Modal } from "../_ui/Modal/Modal";
import ModalFooter from "../_ui/Modal/ModalFooter";

interface IEditAccountModalProps {
	account: ThinAccount;
}

class EditAccountModal extends Component<IEditAccountModalProps & Partial<IModalProps>> {
	public render() {
		const { account, ...modalProps } = this.props;
		return (
				<Modal{...modalProps} title={"Edit Account"}>
					<pre>{JSON.stringify(account, null, 2)}</pre>
					<ModalFooter>
						<IconBtn icon={faTimes} text={"Cancel"} btnProps={{ className: bs.btnOutlineDark }}/>
						<IconBtn icon={faSave} text={"Save"} btnProps={{ className: bs.btnSuccess }}/>
					</ModalFooter>
				</Modal>
		);
	}
}

export default EditAccountModal;
