import * as React from "react";
import { PureComponent, ReactNode } from "react";
import { connect } from "react-redux";
import { AnyAction, Dispatch } from "redux";
import * as bs from "../../global-styles/Bootstrap.scss";
import { setKeyShortcutModalVisible } from "../../redux/global";
import { IRootState } from "../../redux/root";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { Modal, ModalBtnType } from "../_ui/Modal/Modal";

interface IKeyShortcutModalProps {
	readonly keyShortcutModalVisible?: boolean;

	readonly actions?: {
		readonly showModal: () => AnyAction;
		readonly hideModal: () => AnyAction;
	};
}

function mapStateToProps(state: IRootState, props: IKeyShortcutModalProps): IKeyShortcutModalProps {
	return {
		...props,
		keyShortcutModalVisible: state.global.keyShortcutModalVisible,
	};
}

function mapDispatchToProps(dispatch: Dispatch, props: IKeyShortcutModalProps): IKeyShortcutModalProps {
	return {
		...props,
		actions: {
			showModal: () => dispatch(setKeyShortcutModalVisible(true)),
			hideModal: () => dispatch(setKeyShortcutModalVisible(false)),
		},
	};
}

class UCKeyShortcutModal extends PureComponent<IKeyShortcutModalProps> {

	public render(): ReactNode {
		return (
				<>
					<KeyShortcut targetStr={"?"} onTrigger={this.props.actions.showModal}/>
					{
						this.props.keyShortcutModalVisible
						&& <Modal
								title={"Key Shortcuts"}
								onCloseRequest={this.props.actions.hideModal}
								buttons={[
									{
										type: ModalBtnType.OK,
										onClick: this.props.actions.hideModal,
									},
								]}
						>
							<div className={bs.row}>
								<div className={bs.col}>
									<h6>Navigation</h6>
									<p><kbd>gd</kbd> - go to dashboard</p>
									<p><kbd>gt</kbd> - go to transactions</p>
									<p><kbd>rb</kbd> - go to balance history report</p>
									<p><kbd>ra</kbd> - go to asset performance report</p>
								</div>
								<div className={bs.col}>
									<h6>Data</h6>
									<p><kbd>c</kbd> - create an object</p>

									<h6>General</h6>
									<p><kbd>Ctrl + Enter</kbd> - submit forms</p>
									<p><kbd>Esc</kbd> - close modals</p>
								</div>
							</div>
						</Modal>
					}
				</>
		);
	}
}

export const KeyShortcutModal = connect(mapStateToProps, mapDispatchToProps)(UCKeyShortcutModal);
