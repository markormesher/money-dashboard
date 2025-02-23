import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Account } from "../../../api_gen/moneydashboard/v4/accounts_pb.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { accountServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateAccount } from "../../schema/validation.js";
import { Input, Textarea } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";

type AccountEditModalProps = {
  accountId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function AccountEditModal(props: AccountEditModalProps): ReactElement {
  const { accountId, onSaveFinished, onCancel } = props;
  const createNew = accountId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Account>({
    validator: validateAccount,
  });

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.Account",
        id: NULL_UUID,
        name: "",
        notes: "",
        isIsa: false,
        isPension: false,
        excludeFromEnvelopes: false,
        active: true,
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await accountServiceClient.getAccountById({ id: accountId });
      form.setModel(res.account);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load account.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [accountId]);

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
      await accountServiceClient.upsertAccount({ account: form.model });
      toastBus.success("Saved account.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save account.");
      console.log(e);
    }

    form.wg.done();
  });

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
            placeholder={"e.g. LSE:ABC"}
            value={form.model?.name}
            onChange={(evt) => form.patchModel({ name: evt.target.value })}
          />
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

export { AccountEditModal };
