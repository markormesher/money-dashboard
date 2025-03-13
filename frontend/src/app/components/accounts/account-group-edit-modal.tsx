import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { accountGroupServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName, safeNumberValue } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateAccountGroup } from "../../schema/validation.js";
import { Input } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { AccountGroup } from "../../../api_gen/moneydashboard/v4/account_groups_pb.js";

type AccountGroupEditModalProps = {
  accountGroupId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function AccountGroupEditModal(props: AccountGroupEditModalProps): ReactElement {
  const { accountGroupId, onSaveFinished, onCancel } = props;
  const createNew = accountGroupId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<AccountGroup>({
    validator: validateAccountGroup,
  });

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.AccountGroup",
        id: NULL_UUID,
        name: "",
        displayOrder: 0,
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await accountGroupServiceClient.getAccountGroupById({ id: accountGroupId });
      form.setModel(res.accountGroup);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load account group.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [accountGroupId]);

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
      await accountGroupServiceClient.upsertAccountGroup({ accountGroup: form.model });
      toastBus.success("Saved account group.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save account group.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"account_balance"} />
      <span>{createNew ? "Create" : "Edit"} Account Group</span>
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

          <Input
            label={"Display Order"}
            formState={form}
            fieldName={"displayOrder"}
            type={"number"}
            step={"0"}
            value={safeNumberValue(form.model?.displayOrder)}
            onChange={(evt) => form.patchModel({ displayOrder: parseInt(evt.target.value) })}
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

export { AccountGroupEditModal };
