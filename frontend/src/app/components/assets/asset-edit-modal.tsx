import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Asset } from "../../../api_gen/moneydashboard/v4/assets_pb.js";
import { assetServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName, safeNumberValue } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateAsset } from "../../schema/validation.js";
import { Input, Select, Textarea } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { useCurrencyList } from "../../schema/hooks.js";

type AssetEditModalProps = {
  assetId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function AssetEditModal(props: AssetEditModalProps): ReactElement {
  const { assetId, onSaveFinished, onCancel } = props;
  const createNew = assetId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Asset>({
    validator: validateAsset,
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
        $typeName: "moneydashboard.v4.Asset",
        id: NULL_UUID,
        name: "",
        notes: "",
        displayPrecision: 2,
        calculationPrecision: 4,
        active: true,
        currency: undefined,
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await assetServiceClient.getAssetById({ id: assetId });
      form.setModel(res.asset);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load asset.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [assetId]);

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
      await assetServiceClient.upsertAsset({ asset: form.model });
      toastBus.success("Saved asset.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save asset.");
      console.log(e);
    }

    form.wg.done();
  });

  const header = (
    <IconGroup>
      <Icon name={"candlestick_chart"} />
      <span>{createNew ? "Create" : "Edit"} Asset</span>
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
            placeholder={"e.g. LSE:ABC"}
            value={form.model?.name}
            onChange={(evt) => form.patchModel({ name: evt.target.value })}
          />

          <Select
            label={"Currency"}
            formState={form}
            fieldName={"currency"}
            value={form.model?.currency?.id}
            onChange={(evt) => form.patchModel({ currency: currencies?.find((c) => c.id == evt.target.value) })}
          >
            {currencies
              ?.sort((a, b) => a.code.localeCompare(b.code))
              ?.map((c) => <option value={c.id}>{c.code}</option>)}
          </Select>
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
            onChange={(evt) => form.patchModel({ displayPrecision: parseInt(evt.target.value) ?? null })}
          />

          <Input
            label={"Calculation Precision"}
            formState={form}
            fieldName={"calculationPrecision"}
            type={"number"}
            step={1}
            min={0}
            value={safeNumberValue(form.model?.calculationPrecision)}
            onChange={(evt) => form.patchModel({ calculationPrecision: parseInt(evt.target.value) ?? null })}
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

        {createNew ? (
          <hgroup>
            <h6>Note</h6>
            <small>
              Assets are shared across all users and profiles. They <strong>cannot be deleted</strong> after creation;
              they can only be marked as inactive, which will prevent them from being used on new holdings.
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

export { AssetEditModal };
