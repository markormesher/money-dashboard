import * as React from "react";
import { ReactElement, useEffect } from "react";
import * as Toastify from "toastify-js";
import { globalErrorManager } from "../../helpers/errors/error-manager";

require("toastify-js/src/toastify.css");

function ErrorToaster(): ReactElement {
  useEffect(() => {
    globalErrorManager.addNonFatalErrorReceiver((message: string, error: Error) => {
      console.log(message, { error });
      Toastify({
        text: message,
        gravity: "bottom",
        position: "left",
        style: { background: "#dc3545", color: "#ffffff" },
        close: true,
      }).showToast();
    });
  });

  return <></>;
}

export { ErrorToaster };
