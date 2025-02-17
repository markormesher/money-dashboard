import React, { ReactElement } from "react";
import "./page-header.scss";
import { Icon, IconGroup } from "../common/icon/icon.js";
import { useKeyShortcut } from "../../utils/hooks.js";
import { focusFieldByName } from "../../utils/forms.js";

type PageHeaderProps = {
  title: string;
  icon: string;
  buttons?: ReactElement[];
  options?: ReactElement[];
  optionsStartClosed?: boolean;

  onSearchTextChange?: (pattern: RegExp | undefined) => void;
};

function PageHeader(props: React.PropsWithChildren<PageHeaderProps>): ReactElement {
  const [showOptions, setShowOptions] = React.useState(props.optionsStartClosed === true ? false : true);
  const [searchString, setSearchString] = React.useState("");
  const [regexValid, setRegexValid] = React.useState(false);

  React.useEffect(() => {
    try {
      const regex = RegExp(searchString, "i");
      setRegexValid(true);
      props.onSearchTextChange?.(regex);
    } catch {
      setRegexValid(false);
      props.onSearchTextChange?.(undefined);
    }
  }, [searchString]);

  useKeyShortcut({
    targetStr: "/",
    onTrigger: () => focusFieldByName("search"),
  });

  let options = props.options ?? [];
  if (props.onSearchTextChange) {
    options = [
      ...options,
      <fieldset className={"search-input"}>
        <input
          type={"text"}
          placeholder={"Search"}
          name={"search"}
          value={searchString}
          aria-invalid={searchString.length > 0 && !regexValid ? true : undefined}
          onChange={(evt) => setSearchString(evt.target.value)}
        />
      </fieldset>,
    ];
  }

  let buttons = props.buttons ?? [];
  if (options.length > 0) {
    buttons = [
      ...buttons,
      <button className={"outline"} onClick={() => setShowOptions((c) => !c)}>
        <Icon name={"tune"} />
      </button>,
    ];
  }

  return (
    <>
      <section>
        <div className={"page-header"}>
          <h3>
            <IconGroup>
              <Icon name={props.icon} className={"muted"} />
              <span>{props.title}</span>
            </IconGroup>
          </h3>
          {buttons ? <div role={"group"}>{buttons}</div> : null}
        </div>
      </section>

      {options.length > 0 && showOptions ? (
        <section>
          <article className={"page-options"}>{options}</article>
        </section>
      ) : (
        <hr />
      )}
    </>
  );
}

export { PageHeader };
