import React, { ReactElement } from "react";
import "./modal.scss";

type ExternalModalProps = {
  open: boolean;
  onClose: () => void;
};

type ModalProps = ExternalModalProps & {
  interceptClose?: () => boolean;
  header: ReactElement;
};

function Modal(props: React.PropsWithChildren<ModalProps>): ReactElement {
  const { open, onClose, interceptClose, header } = props;

  const maybeClose = () => {
    if (!interceptClose) {
      onClose();
    } else {
      const userReply = interceptClose();
      if (userReply) {
        onClose();
      }
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
      document.addEventListener("keyup", escKeyListener);
    } else {
      document.removeEventListener("keyup", escKeyListener);
    }

    return function cleanup() {
      document.removeEventListener("keyup", escKeyListener);
    };
  }, [open]);

  return (
    <dialog open={open} onClick={bgClickListener}>
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
