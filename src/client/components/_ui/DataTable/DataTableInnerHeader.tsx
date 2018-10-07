import { faExchange, faSortAmountDown, faSortAmountUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Component } from "react";
import * as React from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import { IColumn, ISortEntry } from "./DataTable";
import * as styles from "./DataTable.scss";

interface IDataTableInnerHeaderProps {
	columns: IColumn[];
	sortedColumns: ISortEntry[];
	onToggleSortOrder: (column: IColumn) => void;
}

class DataTableInnerHeader extends Component<IDataTableInnerHeaderProps> {
	public render() {
		const { columns, sortedColumns } = this.props;

		const headers = columns.map((col) => {
			const sortable = col.sortable !== false; // undefined implicitly means yes
			const sortEntry: ISortEntry = sortedColumns.find((sc) => sc.column === col);
			const sorted = sortEntry !== undefined;

			const sortIcon = sorted ? (sortEntry.dir === "asc" ? faSortAmountUp : faSortAmountDown) : faExchange;
			const sortIconFlip = sorted && sortEntry.dir === "asc" ? "vertical" : undefined;
			const sortIconRotate = sortIcon === faExchange ? 90 : undefined;
			const sortIconClasses = combine(bs.mr1, !sorted && styles.sortInactive);

			const clickHandler = sortable ? () => this.props.onToggleSortOrder(col) : undefined;

			return (
					<th key={col.title} className={sortable ? styles.sortable : undefined} onClick={clickHandler}>
						{sortable && <FontAwesomeIcon
								icon={sortIcon}
								fixedWidth={true}
								flip={sortIconFlip}
								rotation={sortIconRotate}
								className={sortIconClasses}
						/>}
						{col.title}
					</th>
			);
		});
		return (
				<thead>
				<tr>
					{headers}
				</tr>
				</thead>
		);
	}
}

export {
	DataTableInnerHeader,
};
