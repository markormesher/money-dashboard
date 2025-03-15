import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { envelopeAllocationServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateEnvelopeAllocation } from "../../schema/validation.js";
import { Input, Select } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { EnvelopeAllocation } from "../../../api_gen/moneydashboard/v4/envelope_allocations_pb.js";
import { convertDateStrToProto, convertDateToProto, formatDateFromProto } from "../../utils/dates.js";
import { useCategoryList, useEnvelopeList } from "../../schema/hooks.js";

type EnvelopeAllocationEditModalProps = {
  envelopeAllocationId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function EnvelopeAllocationEditModal(props: EnvelopeAllocationEditModalProps): ReactElement {
  const { envelopeAllocationId, onSaveFinished, onCancel } = props;
  const createNew = envelopeAllocationId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<EnvelopeAllocation>({
    validator: validateEnvelopeAllocation,
  });

  const categories = useCategoryList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load categories.");
      form.setFatalError(e);
    },
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
        $typeName: "moneydashboard.v4.EnvelopeAllocation",
        id: NULL_UUID,
        startDate: convertDateToProto(new Date()),
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await envelopeAllocationServiceClient.getEnvelopeAllocationById({ id: envelopeAllocationId });
      form.setModel(res.envelopeAllocation);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load envelope allocation.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [envelopeAllocationId]);

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
      await envelopeAllocationServiceClient.upsertEnvelopeAllocation({ envelopeAllocation: form.model });
      toastBus.success("Saved envelope allocation.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save envelope allocation.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"mail"} />
      <span>{createNew ? "Create" : "Edit"} Envelope Allocation</span>
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
            label={"Start Date"}
            formState={form}
            fieldName={"startDate"}
            type={"date"}
            value={formatDateFromProto(form.model?.startDate, "system")}
            onChange={(evt) => form.patchModel({ startDate: convertDateStrToProto(evt.target.value) })}
          />
        </fieldset>

        <fieldset className={"grid"}>
          <Select
            label={"Category"}
            formState={form}
            fieldName={"category"}
            value={form.model?.category?.id}
            onChange={(evt) => form.patchModel({ category: categories?.find((c) => c.id == evt.target.value) })}
          >
            {categories
              ?.filter((c) => c.active)
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((c) => <option value={c.id}>{c.name}</option>)}
          </Select>

          <Select
            label={"Envelope"}
            formState={form}
            fieldName={"envelope"}
            value={form.model?.envelope?.id}
            onChange={(evt) => form.patchModel({ envelope: envelopes?.find((e) => e.id == evt.target.value) })}
          >
            {envelopes
              ?.filter((e) => e.active)
              ?.sort((a, b) => a.name.localeCompare(b.name))
              ?.map((e) => <option value={e.id}>{e.name}</option>)}
          </Select>
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

export { EnvelopeAllocationEditModal };
