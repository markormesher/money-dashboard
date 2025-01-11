import * as React from "react";
import * as bs from "../../global-styles/Bootstrap.scss";
import { KeyShortcut } from "../_ui/KeyShortcut/KeyShortcut";
import { Modal, ModalBtnType } from "../_ui/Modal/Modal";

function KeyShortcutModal(): React.ReactElement {
  const [visible, setVisible] = React.useState(false);

  return (
    <>
      <KeyShortcut targetStr={"?"} onTrigger={() => setVisible(true)} />
      {visible ? (
        <Modal
          title={"Key Shortcuts"}
          onCloseRequest={() => setVisible(false)}
          buttons={[
            {
              type: ModalBtnType.OK,
              onClick: () => setVisible(false),
            },
          ]}
        >
          <div className={bs.row}>
            <div className={bs.col}>
              <h6>Navigation</h6>
              <p>
                <kbd>gd</kbd> - go to dashboard
              </p>
              <p>
                <kbd>gt</kbd> - go to transactions
              </p>
              <p>
                <kbd>rb</kbd> - go to balance history report
              </p>
              <p>
                <kbd>ra</kbd> - go to asset performance report
              </p>
            </div>
            <div className={bs.col}>
              <h6>Data</h6>
              <p>
                <kbd>c</kbd> - create an object
              </p>

              <h6>General</h6>
              <p>
                <kbd>Ctrl + Enter</kbd> - submit forms
              </p>
              <p>
                <kbd>Esc</kbd> - close modals
              </p>
            </div>
          </div>
        </Modal>
      ) : null}
    </>
  );
}

export { KeyShortcutModal };
