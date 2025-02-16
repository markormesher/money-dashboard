import React, { ReactElement } from "react";
import "./modal.css";

type ExternalModalProps = {
  open: boolean;
  onClose: () => void;
};

type ModalProps = ExternalModalProps & {
  header: ReactElement;
  warnOnClose?: boolean;
};

function Modal(props: React.PropsWithChildren<ModalProps>): ReactElement {
  const { open, onClose, header, warnOnClose: closeWarning } = props;
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const maybeClose = () => {
    if (!closeWarning || confirm("Are you sure you want to cancel?")) {
      onClose();
    }
  };

  const bgClickListener = (evt: React.MouseEvent) => {
    if ((evt.target as Element)?.closest("article")) {
      return;
    }

    maybeClose();
  };

  const escKeyListener = (evt: KeyboardEvent) => {
    if (evt.key == "Escape") {
      maybeClose();
    }
  };

  React.useEffect(() => {
    if (open) {
      dialogRef.current?.addEventListener("keyup", escKeyListener);
    } else {
      dialogRef.current?.removeEventListener("keyup", escKeyListener);
    }

    return function cleanup() {
      dialogRef.current?.removeEventListener("keyup", escKeyListener);
    };
  }, [open]);

  return (
    <dialog open={open} onClick={bgClickListener} ref={dialogRef}>
      <article>
        <header>
          {header}
          <button aria-label={"Close"} rel={"prev"} onClick={maybeClose} />
        </header>
        {props.children}
      </article>
    </dialog>
  );
}

export { Modal };
export type { ExternalModalProps, ModalProps };
