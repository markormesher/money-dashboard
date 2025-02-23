import React, { ReactElement } from "react";
import "./modal.css";
import { useFresh } from "../../../utils/hooks.js";
import { ESCAPE, useKeyShortcut } from "../key-shortcuts/key-shortcuts.js";

type ExternalModalProps = {
  open: boolean;
  onClose: () => void;
};

type ModalProps = ExternalModalProps & {
  header: ReactElement;
  warnOnClose?: boolean;
};

function Modal(props: React.PropsWithChildren<ModalProps>): ReactElement {
  const { open, onClose, header } = props;
  const warnOnClose = useFresh(props.warnOnClose);

  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const maybeClose = () => {
    if (!warnOnClose.current || confirm("Are you sure you want to cancel?")) {
      onClose();
    }
  };

  const bgClickListener = (evt: React.MouseEvent) => {
    if ((evt.target as Element)?.closest("article")) {
      return;
    }

    maybeClose();
  };

  useKeyShortcut(ESCAPE, (evt) => {
    evt.preventDefault();
    evt.stopPropagation();
    maybeClose();
  });

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
