import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { envelopeTransferServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName, safeNumberValue } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateEnvelopeTransfer } from "../../schema/validation.js";
import { Input, Select, Textarea } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { useEnvelopeList } from "../../schema/hooks.js";
import { convertDateStrToProto, convertDateToProto, formatDateFromProto } from "../../utils/dates.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { EnvelopeTransfer } from "../../../api_gen/moneydashboard/v4/envelope_transfers_pb.js";

type EnvelopeTransferEditModalProps = {
  envelopeTransferId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function EnvelopeTransferEditModal(props: EnvelopeTransferEditModalProps): ReactElement {
  const { envelopeTransferId, onSaveFinished, onCancel } = props;
  const createNew = envelopeTransferId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<EnvelopeTransfer>({
    validator: validateEnvelopeTransfer,
  });

  const envelopes = useEnvelopeList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load envelopes.");
      form.setFatalError(e);
    },
  });

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.EnvelopeTransfer",
        id: NULL_UUID,
        date: convertDateToProto(new Date()),
        notes: "",
        amount: 0,
      });
      setFocusOnNextRender("date");
      return;
    }

    try {
      form.wg.add();
      const res = await envelopeTransferServiceClient.getEnvelopeTransferById({ id: envelopeTransferId });
      form.setModel(res.envelopeTransfer);
      form.wg.done();
      setFocusOnNextRender("holding");
    } catch (e) {
      toastBus.error("Failed to load envelope transfer.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [envelopeTransferId]);

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
      await envelopeTransferServiceClient.upsertEnvelopeTransfer({ envelopeTransfer: form.model });
      toastBus.success("Saved envelope transfer.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save envelope transfer.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"swap_horiz"} />
      <span>{createNew ? "Create" : "Edit"} Envelope Transfer</span>
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
            label={"Date"}
            formState={form}
            fieldName={"date"}
            type={"date"}
            value={formatDateFromProto(form.model?.date, "system")}
            onChange={(evt) =>
              form.patchModel({
                date: convertDateStrToProto(evt.target.value),
              })
            }
          />

          <Input
            label={"Amount"}
            formState={form}
            fieldName={"amount"}
            type={"number"}
            step={0.01}
            value={safeNumberValue(form.model?.amount)}
            onChange={(evt) => form.patchModel({ amount: parseFloat(evt.target.value) })}
          />
        </fieldset>

        <fieldset className={"grid"}>
          <Select
            label={"From Envelope"}
            nullItemLabel={"Unallocated funds"}
            formState={form}
            fieldName={"fromEnvelope"}
            value={form.model?.fromEnvelope?.id}
            onChange={(evt) => form.patchModel({ fromEnvelope: envelopes?.find((e) => e.id == evt.target.value) })}
          >
            {envelopes
              ?.filter((e) => e.active)
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((e) => <option value={e.id}>{e.name}</option>)}
          </Select>

          <Select
            label={"To Envelope"}
            nullItemLabel={"Unallocated funds"}
            formState={form}
            fieldName={"toEnvelope"}
            value={form.model?.toEnvelope?.id}
            onChange={(evt) => form.patchModel({ toEnvelope: envelopes?.find((e) => e.id == evt.target.value) })}
          >
            {envelopes
              ?.filter((e) => e.active)
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((e) => <option value={e.id}>{e.name}</option>)}
          </Select>
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

export { EnvelopeTransferEditModal };
