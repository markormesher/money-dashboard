import React, { ReactElement } from "react";
import { Modal } from "../common/modal/modal";
import { Icon, IconGroup } from "../common/icon/icon";
import { zeroId } from "../../../config/consts";
import { Currency } from "../../../api_gen/moneydashboard/v4/currencies_pb";
import { useAsyncEffect, useForm } from "../../utils/hooks";
import { currencyServiceClient } from "../../../api/api";
import { toastBus } from "../toaster/toaster";
import { safeNumberValue } from "../../utils/forms";
import { ErrorPanel } from "../common/error/error";

type CurrencyEditModalProps = {
  currencyId: string | undefined;
  onClose: () => void;
};

function CurrencyEditModal(props: CurrencyEditModalProps): ReactElement {
  const { currencyId, onClose } = props;
  const createMode = currencyId == zeroId;

  const form = useForm<Currency>();

  useAsyncEffect(async () => {
    if (currencyId == undefined || currencyId == zeroId) {
      form.setModel(undefined);
      form.setBusy(false);
      return;
    }

    form.setBusy(true);

    try {
      const res = await currencyServiceClient.getAllCurrencies({});
      const c = res.currencies.find((c) => c.id == currencyId);
      form.setModel(c);
      form.setBusy(false);
    } catch (e) {
      form.setModel(undefined);
      form.setBusy(false);

      toastBus.error("Failed to load currency.");
      form.setFatalError(e);
      console.log(e);
    }
  }, [currencyId]);

  const header = (
    <IconGroup>
      <Icon name={"payments"} />
      <span>{createMode ? "Create" : "Edit"} Currency</span>
    </IconGroup>
  );

  let body: ReactElement;
  if (form.fatalError) {
    body = <ErrorPanel error={form.fatalError} noCard={true} />;
  } else {
    body = (
      <form>
        <fieldset className={"grid"}>
          <label>
            Currency Code
            <input
              type={"text"}
              placeholder={"e.g. GBP"}
              value={form.model?.code ?? ""}
              disabled={form.busy}
              onChange={(evt) => form.patchModel({ code: evt.target.value })}
            />
          </label>

          <label>
            Display Symbol
            <input
              type={"text"}
              placeholder={"e.g. £"}
              value={form.model?.symbol ?? ""}
              disabled={form.busy}
              onChange={(evt) => form.patchModel({ symbol: evt.target.value })}
            />
          </label>
        </fieldset>

        <fieldset className={"grid"}>
          <label>
            Display Precision
            <input
              type={"number"}
              step={1}
              min={0}
              disabled={form.busy}
              value={safeNumberValue(form.model?.displayPrecision ?? 2)}
              onChange={(evt) => form.patchModel({ displayPrecision: parseInt(evt.target.value) ?? null })}
            />
          </label>

          <label>
            Calculation Precision
            <input
              type={"number"}
              step={1}
              min={0}
              disabled={form.busy}
              value={safeNumberValue(form.model?.calculationPrecision ?? 4)}
              onChange={(evt) => form.patchModel({ calculationPrecision: parseInt(evt.target.value) ?? null })}
            />
          </label>
        </fieldset>
      </form>
    );
  }

  return (
    <Modal header={header} open={currencyId !== undefined} onClose={onClose}>
      {body}
      <footer>
        <button disabled={form.busy || !form.hasChanges}>
          <IconGroup>
            <Icon name={"save"} />
            <span>Save</span>
          </IconGroup>
        </button>
      </footer>
    </Modal>
  );
}

export { CurrencyEditModal };
