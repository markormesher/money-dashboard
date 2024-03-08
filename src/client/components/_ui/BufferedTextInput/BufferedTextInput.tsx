import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";

type BufferedTextInputProps = {
  readonly delay?: number;
  readonly onValueChange?: (value: string) => void;
  readonly inputProps?: React.HTMLProps<HTMLInputElement>;
};

function BufferedTextInput(props: BufferedTextInputProps): React.ReactElement {
  const { delay, onValueChange, inputProps } = props;
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    return function cleanup() {
      global.clearTimeout(timeoutRef.current);
    };
  }, []);

  function handleValueChange(event: React.KeyboardEvent): void {
    global.clearTimeout(timeoutRef.current);
    const searchTerm = (event.target as HTMLInputElement).value;
    timeoutRef.current = global.setTimeout(() => onValueChange?.(searchTerm), delay ?? 200);
  }

  return <input className={combine(bs.formControl, bs.formControlSm)} onKeyUp={handleValueChange} {...inputProps} />;
}

export { BufferedTextInput };
