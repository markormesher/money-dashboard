import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateProfile } from "../../schema/validation.js";
import { Input } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";
import { Profile } from "../../../api_gen/moneydashboard/v4/profiles_pb.js";
import { profileServiceClient } from "../../../api/api.js";

type ProfileEditModalProps = {
  profileId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function ProfileEditModal(props: ProfileEditModalProps): ReactElement {
  const { profileId, onSaveFinished, onCancel } = props;
  const createNew = profileId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Profile>({
    validator: validateProfile,
  });

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.Profile",
        id: NULL_UUID,
        name: "",
        deleted: false,
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await profileServiceClient.getProfileById({ id: profileId });
      form.setModel(res.profile);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load profile.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [profileId]);

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
      await profileServiceClient.upsertProfile({ profile: form.model });
      toastBus.success("Saved profile.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save profile.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"group"} />
      <span>{createNew ? "Create" : "Edit"} Profile</span>
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

export { ProfileEditModal };
