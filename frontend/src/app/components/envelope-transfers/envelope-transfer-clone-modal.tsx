import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useAsyncHandler } from "../../utils/hooks.js";
import { envelopeTransferServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateCloneEnvelopeTransfersRequest } from "../../schema/validation.js";
import { Input } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { convertDateStrToProto, convertDateToProto, formatDateFromProto } from "../../utils/dates.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { CloneEnvelopeTransfersRequest } from "../../../api_gen/moneydashboard/v4/envelope_transfers_pb.js";

type EnvelopeTransferCloneModalProps = {
  envelopeTransferIds: string[];
  onSaveFinished: () => void;
  onCancel: () => void;
};

function EnvelopeTransferCloneModal(props: EnvelopeTransferCloneModalProps): ReactElement {
  const { envelopeTransferIds, onSaveFinished, onCancel } = props;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<CloneEnvelopeTransfersRequest>({
    validator: validateCloneEnvelopeTransfersRequest,
  });

  React.useEffect(() => {
    form.setModel({
      $typeName: "moneydashboard.v4.CloneEnvelopeTransfersRequest",
      ids: envelopeTransferIds,
      date: convertDateToProto(new Date()),
    });
    setFocusOnNextRender("date");
  }, [envelopeTransferIds]);

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
      await envelopeTransferServiceClient.cloneEnvelopeTransfers(form.model);
      toastBus.success("Cloned envelope transfers");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to clone envelope transfers.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"swap_horiz"} />
      <span>
        Clone {envelopeTransferIds.length} Envelope Transfer{envelopeTransferIds.length > 1 ? "s" : ""}
      </span>
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

export { EnvelopeTransferCloneModal };
