import React, { type ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import type { Currency } from "../../../api_gen/moneydashboard/v4/currencies_pb.js";
import { currencyServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName, safeNumberValue } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateCurrency } from "../../schema/validation.js";
import { Input } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";

type CurrencyEditModalProps = {
	currencyId: string;
	onSaveFinished: () => void;
	onCancel: () => void;
};

function CurrencyEditModal(props: CurrencyEditModalProps): ReactElement {
	const { currencyId, onSaveFinished, onCancel } = props;
	const createNew = currencyId === NULL_UUID;

	const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
	const form = useForm<Currency>({
		validator: validateCurrency,
	});

	React.useEffect(() => {
		if (createNew) {
			form.setModel({
				$typeName: "moneydashboard.v4.Currency",
				id: NULL_UUID,
				code: "",
				symbol: "",
				displayPrecision: 2,
				active: true,
			});
			setFocusOnNextRender("code");
			return;
		}

		form.wgAdd();

		currencyServiceClient
			.getCurrencyById({ id: currencyId })
			.then((res) => {
				form.setModel(res.currency);
				setFocusOnNextRender("code");
			})
			.catch((e) => {
				toastBus.error("Failed to load currency.");
				form.setFatalError(e);
				console.log(e);
			})
			.finally(() => {
				form.wgDone();
			});
	}, [createNew, form.wgAdd, form.wgDone, form.setModel, form.setFatalError, currencyId]);

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

		currencyServiceClient
			.upsertCurrency({ currency: form.model })
			.then(() => {
				toastBus.success("Saved currency.");
				onSaveFinished();
			})
			.catch((e) => {
				toastBus.error("Failed to save currency.");
				console.log(e);
			})
			.finally(() => {
				form.wgDone();
			});
	};

	useKeyShortcut(CTRLENTER, () => save());

	const header = (
		<IconGroup>
			<Icon name={"payments"} />
			<span>{createNew ? "Create" : "Edit"} Currency</span>
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
						label={"Currency Code"}
						formState={form}
						fieldName={"code"}
						type={"text"}
						placeholder={"e.g. GBP"}
						value={form.model?.code}
						onChange={(evt) => form.patchModel({ code: evt.target.value })}
					/>

					<Input
						label={"Symbol"}
						formState={form}
						fieldName={"symbol"}
						type={"text"}
						placeholder={"e.g. £"}
						value={form.model?.symbol}
						onChange={(evt) => form.patchModel({ symbol: evt.target.value })}
					/>
				</fieldset>

				<fieldset className={"grid"}>
					<Input
						label={"Display Precision"}
						formState={form}
						fieldName={"displayPrecision"}
						type={"number"}
						step={1}
						min={0}
						value={safeNumberValue(form.model?.displayPrecision)}
						onChange={(evt) => form.patchModel({ displayPrecision: parseInt(evt.target.value, 10) ?? null })}
					/>

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

				{createNew ? (
					<hgroup>
						<h6>Note </h6>
						<small>
							Currencies are shared across all users and profiles.They <strong> cannot be deleted </strong> after creation; they can only be
							marked as inactive, which will prevent them from being used on new holdings and assets.
						</small>
					</hgroup>
				) : null}
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
						<span> Save </span>
					</IconGroup>
				</button>
			</footer>
		</Modal>
	);
}

export { CurrencyEditModal };
