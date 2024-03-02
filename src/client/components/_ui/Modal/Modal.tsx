import * as React from "react";
import * as bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { IconBtn } from "../IconBtn/IconBtn";
import { MaterialIconName } from "../MaterialIcon/MaterialIcon";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import * as styles from "./Modal.scss";

enum ModalBtnType {
  SAVE = "save",
  CANCEL = "cancel",
  OK = "ok",
}

type ModalBtn = {
  readonly type: ModalBtnType;
  readonly disabled?: boolean;
  readonly onClick?: () => void;
};

type ModalProps = {
  readonly title?: string;
  readonly buttons?: ModalBtn[];
  readonly modalBusy?: boolean;
  readonly onCloseRequest?: () => void;
};

function Modal(props: React.PropsWithChildren<ModalProps>): React.ReactElement {
  const { title, buttons, modalBusy, onCloseRequest } = props;

  React.useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return function cleanup() {
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  function handleKeyDown(evt: KeyboardEvent): void {
    // abort if this event was already cancelled before it reached us
    if (evt.defaultPrevented) {
      return;
    }

    if (evt.key === "Esc" || evt.key === "Escape") {
      onCloseRequest?.();
    }
  }

  function renderBtn(btn: ModalBtn): React.ReactElement {
    let icon: MaterialIconName;
    let label: string;
    let className: string;
    switch (btn.type) {
      case ModalBtnType.SAVE:
        icon = "save";
        label = "Save";
        className = bs.btnSuccess;
        break;

      case ModalBtnType.CANCEL:
        icon = "close";
        label = "Cancel";
        className = bs.btnOutlineDark;
        break;

      case ModalBtnType.OK:
        icon = "check";
        label = "OK";
        className = bs.btnPrimary;
        break;
    }

    const btnElement = (
      <IconBtn
        key={btn.type.toString()}
        icon={icon}
        text={label}
        btnProps={{
          className,
          onClick: btn.onClick,
          disabled: btn.disabled,
        }}
      />
    );

    if (btn.type == ModalBtnType.SAVE) {
      // TODO: wrap in a key shortcut listener for ctrl+enter
      // return (
      //   <KeyShortcut key={btn.type.toString()} ctrlEnter={true} onTrigger={btn.onClick}>
      //     {btnElement}
      //   </KeyShortcut>
      // );
      return btnElement;
    } else {
      return btnElement;
    }
  }

  return (
    <>
      <div className={combine(bs.modal, bs.fade, bs.dBlock, bs.show)}>
        <div className={combine(bs.modalDialog, styles.modalDialog)}>
          <div className={bs.modalContent}>
            {title && (
              <div className={bs.modalHeader}>
                <h5 className={bs.modalTitle}>{title}</h5>
                <button className={bs.btnClose} onClick={onCloseRequest}>
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
            )}
            {props.children && <div className={bs.modalBody}>{props.children}</div>}
            {buttons && buttons.length > 0 && (
              <div className={combine(bs.modalFooter, styles.modalFooter)}>
                {modalBusy && <LoadingSpinner />}
                {!modalBusy && buttons.map(renderBtn)}
              </div>
            )}
          </div>
        </div>
      </div>

      <div className={combine(bs.modalBackdrop, bs.fade, bs.show)} />
    </>
  );
}

export { ModalProps, ModalBtn, Modal, ModalBtnType };
