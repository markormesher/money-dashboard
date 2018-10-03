import * as React from "react";
import * as bs from "../../bootstrap-aliases";
import { ISortEntry } from "./DataTable";
import * as styles from "./DataTable.scss";

interface IDataTableOuterFooterProps {
	pageSize: number;
	currentPage: number;
	sortedColumns: ISortEntry[];
	filteredRowCount: number;
	totalRowCount: number;
}

const sortDirectionFull = {
	asc: "ascending",
	desc: "descending",
};

class DataTableOuterFooter extends React.Component<IDataTableOuterFooterProps> {
	public render() {
		const { pageSize, currentPage, sortedColumns, filteredRowCount, totalRowCount } = this.props;

		const rowRangeFrom = Math.min(filteredRowCount, (currentPage * pageSize) + 1);
		const rowRangeTo = Math.min(filteredRowCount, (currentPage + 1) * pageSize);
		const showTotal = filteredRowCount !== totalRowCount;

		let sortingOrder = "Sorted by";
		sortedColumns.forEach((entry, i) => {
			if (i === 0) {
				sortingOrder += " ";
			} else {
				sortingOrder += ", then ";
			}
			sortingOrder += entry.column.lowercaseTitle || entry.column.title.toLocaleLowerCase();
			sortingOrder += " " + sortDirectionFull[entry.dir];
		});

		return (
				<div className={styles.tableFooter}>
					<p className={bs.floatRight}>
						Showing rows {rowRangeFrom} to {rowRangeTo} of {filteredRowCount}
						{showTotal && <> (filtered from {totalRowCount} total)</>}
						{sortedColumns.length > 0 && <> &bull; {sortingOrder}</>}
					</p>
				</div>
		);
	}
}

export {
	DataTableOuterFooter,
};
