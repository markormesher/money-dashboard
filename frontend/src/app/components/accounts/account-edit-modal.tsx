import React, { type ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import type { Account } from "../../../api_gen/moneydashboard/v4/accounts_pb.js";
import { accountServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateAccount } from "../../schema/validation.js";
import { Input, Select, Textarea } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { useAccountGroupList } from "../../schema/hooks.js";

type AccountEditModalProps = {
	accountId: string;
	onSaveFinished: () => void;
	onCancel: () => void;
};

function AccountEditModal(props: AccountEditModalProps): ReactElement {
	const { accountId, onSaveFinished, onCancel } = props;
	const createNew = accountId === NULL_UUID;

	const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
	const form = useForm<Account>({
		validator: validateAccount,
	});

	const accountGroups = useAccountGroupList({
		wgAdd: form.wgAdd,
		wgDone: form.wgDone,
		onError: React.useCallback(
			(e) => {
				toastBus.error("Failed to load account groups.");
				form.setFatalError(e);
			},
			[form],
		),
	});

	React.useEffect(() => {
		if (createNew) {
			form.setModel({
				$typeName: "moneydashboard.v4.Account",
				id: NULL_UUID,
				name: "",
				notes: "",
				isIsa: false,
				isPension: false,
				active: true,
			});
			setFocusOnNextRender("name");
			return;
		}

		form.wgAdd();

		accountServiceClient
			.getAccountById({ id: accountId })
			.then((res) => {
				form.setModel(res.account);
				setFocusOnNextRender("name");
			})
			.catch((e) => {
				toastBus.error("Failed to load account.");
				form.setFatalError(e);
				console.log(e);
			})
			.finally(() => {
				form.wgDone();
			});
	}, [createNew, form, accountId]);

	React.useEffect(() => {
		if (form.wgCount === 0 && focusOnNextRender) {
			focusFieldByName(focusOnNextRender);
			setFocusOnNextRender(undefined);
		}
	}, [focusOnNextRender, form.wgCount]);

	const save = () => {
		if (form.wgCount > 0 || !form.valid || !form.model) {
			return;
		}

		form.wgAdd();

		accountServiceClient
			.upsertAccount({ account: form.model })
			.then(() => {
				toastBus.success("Saved account.");
				onSaveFinished();
			})
			.catch((e) => {
				toastBus.error("Failed to save account.");
				console.log(e);
			})
			.finally(() => {
				form.wgDone();
			});
	};

	useKeyShortcut(CTRLENTER, () => save());

	const header = (
		<IconGroup>
			<Icon name={"account_balance"} />
			<span>{createNew ? "Create" : "Edit"} Account</span>
		</IconGroup>
	);

	let body: ReactElement;
	if (form.fatalError) {
		body = <ErrorPanel error={form.fatalError} noCard={true} />;
	} else {
		body = (
			<form>
				<fieldset className={"grid"}>
					<Input
						label={"Name"}
						formState={form}
						fieldName={"name"}
						type={"text"}
						value={form.model?.name}
						onChange={(evt) => form.patchModel({ name: evt.target.value })}
					/>

					<Select
						label={"Group"}
						formState={form}
						fieldName={"accountGroup"}
						value={form.model?.accountGroup?.id}
						onChange={(evt) => form.patchModel({ accountGroup: accountGroups?.find((g) => g.id === evt.target.value) })}
					>
						{accountGroups
							?.sort((a, b) => a.displayOrder - b.displayOrder)
							?.map((g) => (
								<option key={g.id} value={g.id} selected={g.id === form.model?.accountGroup?.id}>
									{g.name}
								</option>
							))}
					</Select>
				</fieldset>

				<fieldset className={"grid"}>
					<Input
						label={"ISA"}
						formState={form}
						fieldName={"isIsa"}
						type={"checkbox"}
						role={"switch"}
						checked={form.model?.isIsa ?? false}
						onChange={(evt) => form.patchModel({ isPension: false, isIsa: evt.target.checked })}
					/>

					<Input
						label={"Pension"}
						formState={form}
						fieldName={"isPension"}
						type={"checkbox"}
						role={"switch"}
						checked={form.model?.isPension ?? false}
						onChange={(evt) => form.patchModel({ isIsa: false, isPension: evt.target.checked })}
					/>
				</fieldset>

				<fieldset>
					<Input
						label={"Active"}
						formState={form}
						fieldName={"active"}
						type={"checkbox"}
						role={"switch"}
						checked={form.model?.active ?? false}
						onChange={(evt) => form.patchModel({ active: evt.target.checked })}
					/>
				</fieldset>

				<fieldset className={"grid"}>
					<Textarea
						label={"Notes"}
						formState={form}
						fieldName={"notes"}
						placeholder={""}
						value={form.model?.notes}
						onChange={(evt) => form.patchModel({ notes: evt.target.value })}
					/>
				</fieldset>
			</form>
		);
	}

	return (
		<Modal header={header} open={true} onClose={onCancel} warnOnClose={form.modified}>
			{body}
			<footer>
				<button disabled={form.wgCount > 0 || !form.valid} onClick={() => save()}>
					<IconGroup>
						<Icon name={"save"} />
						<span>Save</span>
					</IconGroup>
				</button>
			</footer>
		</Modal>
	);
}

export { AccountEditModal };
