import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal.js";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { Transaction } from "../../../api_gen/moneydashboard/v4/transactions_pb.js";
import { useAsyncEffect, useAsyncHandler } from "../../utils/hooks.js";
import { transactionServiceClient } from "../../../api/api.js";
import { toastBus } from "../toaster/toaster.js";
import { focusFieldByName, safeNumberValue } from "../../utils/forms.js";
import { ErrorPanel } from "../common/error/error.js";
import { validateTransaction } from "../../schema/validation.js";
import { Input, Select, SuggestionTextInput, Textarea } from "../common/form/inputs.js";
import { useForm } from "../common/form/hook.js";
import { NULL_UUID } from "../../../config/consts.js";
import { useCategoryList, useHoldingList, usePayeeList } from "../../schema/hooks.js";
import { convertDateStrToProto, convertDateToProto, formatDateFromProto } from "../../utils/dates.js";
import { CTRLENTER, useKeyShortcut } from "../common/key-shortcuts/key-shortcuts.js";

type TransactionEditModalProps = {
  transactionId: string;
  onCreateFinished: () => void;
  onEditFinished: () => void;
  onCancel: () => void;
};

function TransactionEditModal(props: TransactionEditModalProps): ReactElement {
  const { transactionId, onCreateFinished, onEditFinished, onCancel } = props;
  const createNew = transactionId == NULL_UUID;

  const [focusOnNextRender, setFocusOnNextRender] = React.useState<string>();
  const form = useForm<Transaction>({
    validator: (v) => validateTransaction(v, holdings ?? []),
  });

  const payees = usePayeeList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load payees.");
      form.setFatalError(e);
    },
    dependencies: [form.modelIteration],
  });

  const holdings = useHoldingList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load holdings.");
      form.setFatalError(e);
    },
  });

  const categories = useCategoryList({
    wg: form.wg,
    onError: (e) => {
      toastBus.error("Failed to load categories.");
      form.setFatalError(e);
    },
  });

  const [holdingsPerAccount, setHoldingsPerAccount] = React.useState<Record<string, number>>();
  React.useEffect(() => {
    if (!holdings) {
      return;
    }

    const hpa: Record<string, number> = {};
    holdings.forEach((h) => {
      hpa[h.account?.id ?? ""] = (hpa[h.account?.id ?? ""] ?? 0) + 1;
    });
    setHoldingsPerAccount(hpa);
  }, [holdings]);

  useAsyncEffect(async () => {
    if (createNew) {
      form.setModel({
        $typeName: "moneydashboard.v4.Transaction",
        id: NULL_UUID,
        date: convertDateToProto(new Date()),
        budgetDate: convertDateToProto(new Date()),
        creationDate: convertDateToProto(new Date()),
        payee: "",
        notes: "",
        amount: 0,
        unitValue: 0,
        deleted: false,
      });
      setFocusOnNextRender("date");
      return;
    }

    try {
      form.wg.add();
      const res = await transactionServiceClient.getTransactionById({ id: transactionId });
      form.setModel(res.transaction);
      form.wg.done();
      setFocusOnNextRender("holding");
    } catch (e) {
      toastBus.error("Failed to load transaction.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [transactionId]);

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
      await transactionServiceClient.upsertTransaction({ transaction: form.model });
      toastBus.success("Saved transaction.");
      if (transactionId == NULL_UUID) {
        // clear SOME of the record to get ready to edit again
        form.setModel({
          ...form.model,
          creationDate: convertDateToProto(new Date()),
          payee: "",
          category: undefined,
          amount: 0,
          unitValue: 0,
          notes: "",
        });
        setFocusOnNextRender("payee");
        onCreateFinished();
      } else {
        onEditFinished();
      }
    } catch (e) {
      toastBus.error("Failed to save transaction.");
      console.log(e);
    }

    form.wg.done();
  });

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"list"} />
      <span>{createNew ? "Create" : "Edit"} Transaction</span>
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
                budgetDate: convertDateStrToProto(evt.target.value),
              })
            }
          />

          <Input
            label={"Budget Date"}
            formState={form}
            fieldName={"budgetDate"}
            type={"date"}
            tabIndex={-1}
            value={formatDateFromProto(form.model?.budgetDate, "system")}
            onChange={(evt) => form.patchModel({ budgetDate: convertDateStrToProto(evt.target.value) })}
          />
        </fieldset>

        <fieldset className={"grid"}>
          <Select
            label={"Account / Holding"}
            formState={form}
            fieldName={"holding"}
            value={form.model?.holding?.id}
            onChange={(evt) => form.patchModel({ holding: holdings?.find((c) => c.id == evt.target.value) })}
          >
            {holdings
              ?.filter((h) => h.active)
              ?.sort((a, b) => `${a.account?.name} / ${a.name}`.localeCompare(`${b.account?.name} / ${b.name}`))
              ?.map((h) => (
                <option value={h.id} selected={h.id == form.model?.holding?.id}>
                  {(holdingsPerAccount?.[h.account?.id ?? ""] ?? 0) > 1 ? (
                    <>
                      {h.account?.name} &nbsp;&nbsp;&#x2022;&nbsp;&nbsp; {h.name}
                    </>
                  ) : (
                    h.account?.name
                  )}
                </option>
              ))}
          </Select>

          <SuggestionTextInput
            label={"Payee"}
            formState={form}
            fieldName={"payee"}
            candidates={payees ?? []}
            value={form.model?.payee}
            onChange={(evt) => form.patchModel({ payee: evt.target.value })}
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
              ?.map((c) => (
                <option value={c.id} selected={c.id == form.model?.category?.id}>
                  {c.name}
                </option>
              ))}
          </Select>

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

        {form.model?.category?.isCapitalEvent && form.model.holding?.asset ? (
          <fieldset className={"grid"}>
            <Input
              label={"Unit Value"}
              formState={form}
              fieldName={"unitValue"}
              type={"number"}
              step={0.0001}
              value={safeNumberValue(form.model?.unitValue)}
              onChange={(evt) => form.patchModel({ unitValue: parseFloat(evt.target.value) })}
            />

            <IconGroup>
              <Icon name={"info"} />
              <small>
                This is the acquisition cost or disposal value of <u>each</u> unit of the asset in this transaction.
              </small>
            </IconGroup>
          </fieldset>
        ) : null}

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

export { TransactionEditModal };
