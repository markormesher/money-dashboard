import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Envelope } from "../../../api_gen/moneydashboard/v4/envelopes_pb.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { envelopeServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateEnvelope } from "../../schema/validation.js";
import { Input } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";

type EnvelopeEditModalProps = {
  envelopeId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function EnvelopeEditModal(props: EnvelopeEditModalProps): ReactElement {
  const { envelopeId, onSaveFinished, onCancel } = props;
  const createNew = envelopeId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Envelope>({
    validator: validateEnvelope,
  });

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.Envelope",
        id: NULL_UUID,
        name: "",
        active: true,
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await envelopeServiceClient.getEnvelopeById({ id: envelopeId });
      form.setModel(res.envelope);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load envelope.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [envelopeId]);

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
      await envelopeServiceClient.upsertEnvelope({ envelope: form.model });
      toastBus.success("Saved envelope.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save envelope.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"mail"} />
      <span>{createNew ? "Create" : "Edit"} Envelope</span>
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

export { EnvelopeEditModal };
