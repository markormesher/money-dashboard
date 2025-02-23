import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Category } from "../../../api_gen/moneydashboard/v4/categories_pb.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { categoryServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateCategory } from "../../schema/validation.js";
import { Input } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";

type CategoryEditModalProps = {
  categoryId: string;
  onSaveFinished: () => void;
  onCancel: () => void;
};

function CategoryEditModal(props: CategoryEditModalProps): ReactElement {
  const { categoryId, onSaveFinished, onCancel } = props;
  const createNew = categoryId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Category>({
    validator: validateCategory,
  });

  const patchMutuallyExclusiveFlag = function (
    flag:
      | "isMemo"
      | "isInterestIncome"
      | "isDividendIncome"
      | "isCapitalAcquisition"
      | "isCapitalDisposal"
      | "isCapitalEventFee",
    value: boolean,
  ): void {
    form.patchModel({
      isMemo: false,
      isInterestIncome: false,
      isDividendIncome: false,
      isCapitalAcquisition: false,
      isCapitalDisposal: false,
      isCapitalEventFee: false,
      [flag]: value,
    });
  };

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.Category",
        id: NULL_UUID,
        name: "",
        isMemo: false,
        isInterestIncome: false,
        isDividendIncome: false,
        isCapitalAcquisition: false,
        isCapitalDisposal: false,
        isCapitalEventFee: false,
        active: true,
      });
      setFocusOnNextRender("name");
      return;
    }

    try {
      form.wg.add();
      const res = await categoryServiceClient.getCategoryById({ id: categoryId });
      form.setModel(res.category);
      form.wg.done();
      setFocusOnNextRender("name");
    } catch (e) {
      toastBus.error("Failed to load category.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [categoryId]);

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
      await categoryServiceClient.upsertCategory({ category: form.model });
      toastBus.success("Saved category.");
      onSaveFinished();
    } catch (e) {
      toastBus.error("Failed to save category.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"label"} />
      <span>{createNew ? "Create" : "Edit"} Category</span>
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

        <fieldset className={"grid"}>
          <Input
            label={"Interest Income"}
            formState={form}
            fieldName={"isDividendIncome"}
            type={"checkbox"}
            role={"switch"}
            checked={form.model?.isInterestIncome ?? false}
            onChange={(evt) => patchMutuallyExclusiveFlag("isInterestIncome", evt.target.checked)}
          />

          <Input
            label={"Dividend Income"}
            formState={form}
            fieldName={"isDividendIncome"}
            type={"checkbox"}
            role={"switch"}
            checked={form.model?.isDividendIncome ?? false}
            onChange={(evt) => patchMutuallyExclusiveFlag("isDividendIncome", evt.target.checked)}
          />
        </fieldset>

        <fieldset className={"grid"}>
          <Input
            label={"Capital Acquisition"}
            formState={form}
            fieldName={"isCapitalAcquisition"}
            type={"checkbox"}
            role={"switch"}
            checked={form.model?.isCapitalAcquisition ?? false}
            onChange={(evt) => patchMutuallyExclusiveFlag("isCapitalAcquisition", evt.target.checked)}
          />

          <Input
            label={"Capital Disposal"}
            formState={form}
            fieldName={"isCapitalDisposal"}
            type={"checkbox"}
            role={"switch"}
            checked={form.model?.isCapitalDisposal ?? false}
            onChange={(evt) => patchMutuallyExclusiveFlag("isCapitalDisposal", evt.target.checked)}
          />
        </fieldset>

        <fieldset className={"grid"}>
          <Input
            label={"Capital Event Fee"}
            formState={form}
            fieldName={"isCapitalEventFee"}
            type={"checkbox"}
            role={"switch"}
            checked={form.model?.isCapitalEventFee ?? false}
            onChange={(evt) => patchMutuallyExclusiveFlag("isCapitalEventFee", evt.target.checked)}
          />

          <Input
            label={"Memo"}
            formState={form}
            fieldName={"isMemo"}
            type={"checkbox"}
            role={"switch"}
            checked={form.model?.isMemo ?? false}
            onChange={(evt) => patchMutuallyExclusiveFlag("isMemo", evt.target.checked)}
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

export { CategoryEditModal };
