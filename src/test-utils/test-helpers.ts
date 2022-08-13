import { ReactWrapper } from "enzyme";
import { icon } from "../client/components/_ui/MaterialIcon/MaterialIcon.scss";

function voidListener(): void {
  // ...
}

function removeIconText(wrapper: ReactWrapper): ReactWrapper {
  wrapper.find(`span.${icon}`).forEach((e) => {
    e.getDOMNode().innerHTML = "";
  });
  return wrapper;
}

export { voidListener, removeIconText };
