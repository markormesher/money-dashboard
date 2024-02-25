import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { combine } from "../../../helpers/style-helpers";
import { IconBtn } from "../IconBtn/IconBtn";

type PagerBtnsProps = {
  // NB: currentPage is 0-indexed
  readonly currentPage: number;
  readonly totalPages: number;
  readonly disabled?: boolean;
  readonly onPageChange?: (page: number) => void;
};

function PagerBtns(props: PagerBtnsProps): React.ReactElement {
  const { disabled, currentPage, totalPages, onPageChange } = props;

  const btnStyles = combine(bs.btn, bs.btnOutlineDark);
  const prevBtnDisabled = disabled || currentPage === 0;
  const nextBtnDisabled = disabled || currentPage >= totalPages - 1;

  function handlePrevClick(): void {
    if (currentPage > 0) {
      onPageChange?.(currentPage - 1);
    }
  }

  function handleNextClick(): void {
    if (currentPage < totalPages - 1) {
      onPageChange?.(currentPage + 1);
    }
  }

  return (
    <div className={combine(bs.btnGroup, bs.btnGroupSm)}>
      <IconBtn
        icon={"arrow_back"}
        onClick={handlePrevClick}
        btnProps={{
          className: bs.btnOutlineDark,
          disabled: prevBtnDisabled,
        }}
      />
      <button className={btnStyles} disabled={true}>
        Page {totalPages === 0 ? 0 : currentPage + 1} of {totalPages}
      </button>
      <IconBtn
        icon={"arrow_forward"}
        onClick={handleNextClick}
        btnProps={{
          className: bs.btnOutlineDark,
          disabled: nextBtnDisabled,
        }}
      />
    </div>
  );
}

export { PagerBtns };
