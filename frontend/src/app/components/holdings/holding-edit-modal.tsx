import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Holding } from "../../../api_gen/moneydashboard/v4/holdings_pb.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
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
  const createNew = holdingId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Holding>({
    validator: validateHolding,
  });

  const accounts = useAccountList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load accounts.");
      form.setFatalError(e);
    },
  });

  const assets = useAssetList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load assets.");
      form.setFatalError(e);
    },
  });

  const currencies = useCurrencyList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load currencies.");
      form.setFatalError(e);
    },
  });

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.Holding",
        id: NULL_UUID,
        name: "",
        currency: undefined,
        asset: undefined,
        account: undefined,
        active: true,
      });
      setFocusOnNextRender("account");
      return;
    }

    try {
      form.wg.add();
      const res = await holdingServiceClient.getHoldingById({ id: holdingId });
      form.setModel(res.holding);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load holding.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [holdingId]);

  React.useEffect(() => {
    if (form.wg.count == 0 && !!focusOnNextRender) {
      focusFieldByName(focusOnNextRender);
      setFocusOnNextRender(undefined);
    }
  }, [focusOnNextRender, form.wg.count]);

  const save = useAsyncHandler(async () => {
    if (form.wg.count > 0 || !form.valid || !form.model) {
      return;
    }

    form.wg.add();

    try {
      await holdingServiceClient.upsertHolding({ holding: form.model });
      toastBus.success("Saved holding.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save holding.");
      console.log(e);
    }

    form.wg.done();
  });

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
            onChange={(evt) => form.patchModel({ account: accounts?.find((c) => c.id == evt.target.value) })}
          >
            {accounts
              ?.filter((a) => a.active)
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((c) => <option value={c.id}>{c.name}</option>)}
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
            onChange={(evt) =>
              form.patchModel({ asset: undefined, currency: currencies?.find((c) => c.id == evt.target.value) })
            }
          >
            {currencies
              ?.filter((c) => c.active)
              ?.sort((a, b) => a.code.localeCompare(b.code))
              ?.map((c) => <option value={c.id}>{c.code}</option>)}
          </Select>

          <Select
            label={"Asset Type"}
            formState={form}
            fieldName={"asset"}
            value={form.model?.asset?.id}
            onChange={(evt) =>
              form.patchModel({ currency: undefined, asset: assets?.find((a) => a.id == evt.target.value) })
            }
          >
            {assets
              ?.filter((a) => a.active)
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((a) => <option value={a.id}>{a.name}</option>)}
          </Select>
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
        <button disabled={form.wg.count > 0 || !form.valid} onClick={() => save()}>
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
