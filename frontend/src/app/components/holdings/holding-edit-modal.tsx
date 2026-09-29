import React, { type ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import type { Holding } from "../../../api_gen/moneydashboard/v4/holdings_pb.js";
import { holdingServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateHolding } from "../../schema/validation.js";
import { Input, Select } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { useAccountList, useAssetList, useCurrencyList } from "../../schema/hooks.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";

type HoldingEditModalProps = {
	holdingId: string;
	onSaveFinished: () => void;
	onCancel: () => void;
};

function HoldingEditModal(props: HoldingEditModalProps): ReactElement {
	const { holdingId, onSaveFinished, onCancel } = props;
	const createNew = holdingId === NULL_UUID;

	const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
	const form = useForm<Holding>({
		validator: validateHolding,
	});

	const accounts = useAccountList({
		wgAdd: form.wgAdd,
		wgDone: form.wgDone,
		onError: React.useCallback(
			(e) => {
				toastBus.error("Failed to load accounts.");
				form.setFatalError(e);
			},
			[form.setFatalError],
		),
	});

	const assets = useAssetList({
		wgAdd: form.wgAdd,
		wgDone: form.wgDone,
		onError: React.useCallback(
			(e) => {
				toastBus.error("Failed to load assets.");
				form.setFatalError(e);
			},
			[form.setFatalError],
		),
	});

	const currencies = useCurrencyList({
		wgAdd: form.wgAdd,
		wgDone: form.wgDone,
		onError: React.useCallback(
			(e) => {
				toastBus.error("Failed to load currencies.");
				form.setFatalError(e);
			},
			[form.setFatalError],
		),
	});

	React.useEffect(() => {
		if (createNew) {
			form.setModel({
				$typeName: "moneydashboard.v4.Holding",
				id: NULL_UUID,
				name: "",
				currency: undefined,
				asset: undefined,
				account: undefined,
				excludeFromEnvelopes: false,
				excludeFromReports: false,
				active: true,
			});
			setFocusOnNextRender("account");
			return;
		}

		form.wgAdd();

		holdingServiceClient
			.getHoldingById({ id: holdingId })
			.then((res) => {
				form.setModel(res.holding);
				setFocusOnNextRender("name");
			})
			.catch((e) => {
				toastBus.error("Failed to load holding.");
				form.setFatalError(e);
				console.log(e);
			})
			.finally(() => {
				form.wgDone();
			});
	}, [createNew, form.wgAdd, form.wgDone, form.setModel, form.setFatalError, holdingId]);

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

		holdingServiceClient
			.upsertHolding({ holding: form.model })
			.then(() => {
				toastBus.success("Saved holding.");
				onSaveFinished();
			})
			.catch((e) => {
				toastBus.error("Failed to save holding.");
				console.log(e);
			})
			.finally(() => {
				form.wgDone();
			});
	};

	useKeyShortcut(CTRLENTER, () => save());

	const header = (
		<IconGroup>
			<Icon name={"account_balance_wallet"} />
			<span>{createNew ? "Create" : "Edit"} Holding</span>
		</IconGroup>
	);

	let body: ReactElement;
	if (form.fatalError) {
		body = <ErrorPanel error={form.fatalError} noCard={true} />;
	} else {
		body = (
			<form>
				<fieldset className={"grid"}>
					<Select
						label={"Account"}
						formState={form}
						fieldName={"account"}
						value={form.model?.account?.id}
						onChange={(evt) => form.patchModel({ account: accounts?.find((c) => c.id === evt.target.value) })}
					>
						{accounts
							?.filter((a) => a.active)
							?.sort((a, b) => a.name.localeCompare(b.name))
							?.map((a) => (
								<option key={a.id} value={a.id} selected={a.id === form.model?.account?.id}>
									{a.name}
								</option>
							))}
					</Select>

					<Input
						label={"Name"}
						formState={form}
						fieldName={"name"}
						type={"text"}
						value={form.model?.name}
						onChange={(evt) => form.patchModel({ name: evt.target.value })}
					/>
				</fieldset>

				<fieldset className={"grid"}>
					<Select
						label={"Cash Currency"}
						formState={form}
						fieldName={"currency"}
						value={form.model?.currency?.id}
						onChange={(evt) => form.patchModel({ asset: undefined, currency: currencies?.find((c) => c.id === evt.target.value) })}
					>
						{currencies
							?.filter((c) => c.active)
							?.sort((a, b) => a.code.localeCompare(b.code))
							?.map((c) => (
								<option key={c.id} value={c.id} selected={c.id === form.model?.currency?.id}>
									{c.code}
								</option>
							))}
					</Select>

					<Select
						label={"Asset Type"}
						formState={form}
						fieldName={"asset"}
						value={form.model?.asset?.id}
						onChange={(evt) => form.patchModel({ currency: undefined, asset: assets?.find((a) => a.id === evt.target.value) })}
					>
						{assets
							?.filter((a) => a.active)
							?.sort((a, b) => a.name.localeCompare(b.name))
							?.map((a) => (
								<option key={a.id} value={a.id} selected={a.id === form.model?.asset?.id}>
									{a.name}
								</option>
							))}
					</Select>
				</fieldset>

				<fieldset className={"grid"}>
					<Input
						label={"Exclude from Envelopes"}
						formState={form}
						fieldName={"excludeFromEnvelopes"}
						type={"checkbox"}
						role={"switch"}
						checked={form.model?.excludeFromEnvelopes ?? false}
						onChange={(evt) => form.patchModel({ excludeFromEnvelopes: evt.target.checked })}
					/>

					<Input
						label={"Exclude from Reports"}
						formState={form}
						fieldName={"excludeFromReports"}
						type={"checkbox"}
						role={"switch"}
						checked={form.model?.excludeFromReports ?? false}
						onChange={(evt) => form.patchModel({ excludeFromReports: evt.target.checked })}
					/>
				</fieldset>

				<fieldset className={"grid"}>
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

				<hgroup>
					<h6>Note</h6>
					<small>
						Holdings represent a balance of cash in a single currency <em>or</em> an investment in a single asset type.
					</small>
				</hgroup>
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

export { HoldingEditModal };
