import * as React from "react";
import bs from "../../../global-styles/Bootstrap.scss";
import { BufferedTextInput } from "../BufferedTextInput/BufferedTextInput";
import { PagerBtns } from "../PagerBtns/PagerBtns";
import styles from "./DataTable.scss";

type DataTableOuterHeaderProps = {
  readonly loading: boolean;
  readonly currentPage: number;
  readonly pageSize: number;
  readonly rowCount: number;
  readonly onPageChange?: (page: number) => void;
  readonly onSearchTermChange?: (term: string) => void;
};

function DataTableOuterHeader(props: DataTableOuterHeaderProps): React.ReactElement {
  const { pageSize, loading, currentPage, rowCount } = props;
  const totalPages = rowCount === 0 ? 0 : Math.ceil(rowCount / pageSize);

  return (
    <div className={styles.tableHeader}>
      <div className={bs.floatStart}>
        <PagerBtns
          disabled={loading}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={props.onPageChange}
        />
      </div>
      <div className={bs.floatEnd}>
        <BufferedTextInput
          inputProps={{
            placeholder: "Search",
          }}
          onValueChange={props.onSearchTermChange}
        />
      </div>
    </div>
  );
}

export { DataTableOuterHeader };
