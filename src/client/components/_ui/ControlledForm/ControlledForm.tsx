import * as React from "react";

type ControlledFormProps = {
  readonly onSubmit?: () => void;
};

function ControlledForm(props: React.PropsWithChildren<ControlledFormProps>): React.ReactElement {
  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyPress);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyPress);
    };
  }, []);

  function handleKeyPress(evt: KeyboardEvent): void {
    if ((evt.ctrlKey || evt.metaKey) && evt.key === "Enter") {
      handleSubmit();
    }
  }

  function handleSubmit(event?: React.FormEvent): void {
    event?.preventDefault();
    props.onSubmit?.();
  }

  return <form onSubmit={handleSubmit}>{props.children}</form>;
}

export { ControlledForm };
