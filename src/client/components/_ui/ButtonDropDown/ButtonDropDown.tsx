import * as React from "react";
import { IconBtn } from "../IconBtn/IconBtn";
import { MaterialIconName, MaterialIconProps } from "../MaterialIcon/MaterialIcon";
import * as styles from "./ButtonDropDown.scss";

type ButtonDropDownProps = {
  readonly text: string;
  readonly icon: MaterialIconName;
  readonly iconProps?: Partial<MaterialIconProps>;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
  readonly onBtnClick?: () => void;
  readonly dropDownContents?: React.ReactElement;
  readonly placement?: "left" | "right";
};

function ButtonDropDown(props: ButtonDropDownProps): React.ReactElement {
  const { text, icon, iconProps, btnProps, onBtnClick, dropDownContents, placement } = props;
  const btnRef = React.useRef<HTMLButtonElement>(null);

  function getChooserPosition(): React.CSSProperties {
    if (!btnRef.current) {
      return { display: "none" };
    }

    const bounds = btnRef.current.getBoundingClientRect();
    const props: React.CSSProperties = {
      top: `${bounds.bottom}px`,
    };

    if (placement === "right") {
      return {
        ...props,
        right: `${document.body.clientWidth - bounds.right}px`,
      };
    } else {
      return {
        ...props,
        left: `${bounds.left}px`,
      };
    }
  }

  function renderChooser(): React.ReactElement | null {
    if (!dropDownContents) {
      return null;
    }

    return (
      <div className={styles.chooser} style={getChooserPosition()}>
        {dropDownContents}
      </div>
    );
  }

  return (
    <>
      <IconBtn
        icon={icon}
        text={text}
        iconProps={iconProps}
        btnProps={{
          ...btnProps,
          ref: btnRef,
          onClick: onBtnClick,
        }}
      />
      {renderChooser()}
    </>
  );
}

export { ButtonDropDown, ButtonDropDownProps };
