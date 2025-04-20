import React, { ReactElement } from "react";
import { Modal } from "../modal/modal.js";
import { Icon, IconGroup } from "../icon/icon.js";
import { useForm } from "../form/hook.js";
import { DateRange, dateRangePresets, validateDateRange } from "../../../utils/date-range.js";
import { CTRLENTER, useKeyShortcut } from "../key-shortcuts/key-shortcuts.js";
import { Input } from "../form/inputs.js";
import { convertDateStrToProto, formatDateFromProto } from "../../../utils/dates.js";
import "./date-range-picker.css";

type DateRangePickerProps = {
  dateRange: DateRange;
  onSave: (dateRange: DateRange) => void;
  onCancel: () => void;
};

function DateRangePicker(props: DateRangePickerProps): ReactElement {
  const { dateRange, onSave, onCancel } = props;

  const form = useForm<DateRange>({
    validator: validateDateRange,
  });
  React.useEffect(() => form.setModel(dateRange), [dateRange]);

  const save = () => {
    if (form.wg.count > 0 || !form.valid || !form.model) {
      return;
    }

    onSave(form.model);
  };

  useKeyShortcut(CTRLENTER, () => save());

  const header = (
    <IconGroup>
      <Icon name={"calendar_month"} />
      <span>Select Date Range</span>
    </IconGroup>
  );

  const presetLinks = dateRangePresets.map((p) => {
    return (
      <li>
        <a href={"#"} onClick={() => form.patchModel(p[1])}>
          {p[0]}
        </a>
      </li>
    );
  });

  const body = (
    <>
      <form>
        <fieldset className={"grid"}>
          <Input
            label={"Start"}
            formState={form}
            fieldName={"startDate"}
            type={"date"}
            value={formatDateFromProto(form.model?.startDate, "system")}
            onChange={(evt) =>
              form.patchModel({
                startDate: convertDateStrToProto(evt.target.value),
              })
            }
          />

          <Input
            label={"End"}
            formState={form}
            fieldName={"endDate"}
            type={"date"}
            value={formatDateFromProto(form.model?.endDate, "system")}
            onChange={(evt) =>
              form.patchModel({
                endDate: convertDateStrToProto(evt.target.value),
              })
            }
          />
        </fieldset>
      </form>
      <hr />
      <ul className={"preset-links"}>{presetLinks}</ul>
    </>
  );

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

export { DateRangePicker };
