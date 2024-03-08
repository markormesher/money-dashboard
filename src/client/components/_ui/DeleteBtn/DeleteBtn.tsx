import * as React from "react";
import { IconBtn } from "../IconBtn/IconBtn";

type DeleteBtnProps<Payload> = {
  readonly timeout?: number;
  readonly payload?: Payload;
  readonly onConfirmedClick?: (payload?: Payload) => void;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
};

function DeleteBtn<Payload>(props: DeleteBtnProps<Payload>): React.ReactElement {
  const { btnProps, payload, timeout, onConfirmedClick } = props;

  const [triggered, setTriggered] = React.useState(false);
  const [running, setRunning] = React.useState(false);
  const timeoutRef = React.useRef<NodeJS.Timeout>();

  React.useEffect(() => {
    return function cleanup() {
      global.clearTimeout(timeoutRef.current);
    };
  }, []);

  const btnIcon = running ? "hourglass_empty" : triggered ? "warning" : "delete";
  const btnText = running ? undefined : triggered ? "Sure?" : "Delete";

  function handleClick(payload?: Payload): void {
    if (!triggered) {
      setTriggered(true);
      timeoutRef.current = global.setTimeout(() => setTriggered(false), timeout ?? 2000);
    } else {
      clearTimeout(timeoutRef.current);
      setRunning(true);
      onConfirmedClick?.(payload);
    }
  }

  return (
    <IconBtn<Payload>
      icon={btnIcon}
      text={btnText}
      payload={payload}
      onClick={handleClick}
      btnProps={{
        ...btnProps,
        disabled: (btnProps && btnProps.disabled) || running,
      }}
      iconProps={{
        spin: running,
      }}
    />
  );
}

export { DeleteBtn };
