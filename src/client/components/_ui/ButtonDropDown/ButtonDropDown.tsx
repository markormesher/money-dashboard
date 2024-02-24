import * as React from "react";
import { PureComponent, CSSProperties, ReactNode, RefObject } from "react";
import { IconBtn } from "../IconBtn/IconBtn";
import { MaterialIconName, MaterialIconProps } from "../MaterialIcon/MaterialIcon";
import * as styles from "./ButtonDropDown.scss";

interface IButtonDropDownProps {
  readonly text: string;
  readonly icon: MaterialIconName;
  readonly iconProps?: Partial<MaterialIconProps>;
  readonly btnProps?: React.HTMLProps<HTMLButtonElement>;
  readonly onBtnClick?: () => void;
  readonly dropDownContents?: ReactNode;
  readonly placement?: "left" | "right";
}

class ButtonDropDown extends PureComponent<IButtonDropDownProps> {
  private readonly btnRef: RefObject<HTMLButtonElement>;

  constructor(props: IButtonDropDownProps) {
    super(props);

    this.btnRef = React.createRef();

    this.renderChooser = this.renderChooser.bind(this);
    this.getChooserPosition = this.getChooserPosition.bind(this);
  }

  public render(): ReactNode {
    const { text, icon, iconProps, btnProps, onBtnClick } = this.props;

    return (
      <>
        <IconBtn
          icon={icon}
          text={text}
          iconProps={iconProps}
          btnProps={{
            ...btnProps,
            ref: this.btnRef,
            onClick: onBtnClick,
          }}
        />
        {this.renderChooser()}
      </>
    );
  }

  private renderChooser(): ReactNode {
    const { dropDownContents } = this.props;

    if (!dropDownContents) {
      return null;
    }

    return (
      <div className={styles.chooser} style={this.getChooserPosition()}>
        {this.props.dropDownContents}
      </div>
    );
  }

  private getChooserPosition(): CSSProperties {
    /* istanbul ignore if: cannot be simulated with JSDOM/Enzyme */
    if (!this.btnRef.current) {
      return { display: "none" };
    }

    const bounds = this.btnRef.current.getBoundingClientRect();
    const props: CSSProperties = {
      top: `${bounds.bottom}px`,
    };

    if (this.props.placement === "right") {
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
}

export { ButtonDropDown, IButtonDropDownProps };
