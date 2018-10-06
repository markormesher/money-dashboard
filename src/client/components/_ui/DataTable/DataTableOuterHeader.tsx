import { faArrowLeft, faArrowRight } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import * as React from "react";
import { Component } from "react";
import * as bs from "../../../bootstrap-aliases";
import { combine } from "../../../helpers/style-helpers";
import * as styles from "./DataTable.scss";

interface IDataTableOuterHeaderProps {
	loading: boolean;
	currentPage: number;
	pageSize: number;
	rowCount: number;
	onPrevPageClick: () => void;
	onNextPageClick: () => void;
	onSearchTermSet: (term: string) => void;
}

class DataTableOuterHeader<Model> extends Component<IDataTableOuterHeaderProps> {

	private searchTermUpdateTimeout: NodeJS.Timer = undefined;

	constructor(props: IDataTableOuterHeaderProps) {
		super(props);
		this.handleSearchTermChange = this.handleSearchTermChange.bind(this);
	}

	public render() {
		const { pageSize, onPrevPageClick, onNextPageClick, loading, currentPage, rowCount } = this.props;

		const displayCurrentPage = rowCount === 0 ? 0 : currentPage + 1;
		const totalPages = rowCount === 0 ? 0 : Math.ceil(rowCount / pageSize);

		const prevBtnDisabled = loading || currentPage === 0;
		const nextBtnDisabled = loading || currentPage >= totalPages - 1;
		const btnStyles = combine(bs.btn, bs.btnOutlineDark);

		return (
				<div className={styles.tableHeader}>
					<div className={combine(bs.floatLeft, bs.btnGroup, bs.btnGroupSm)}>
						<button className={btnStyles} disabled={prevBtnDisabled} onClick={onPrevPageClick}>
							<FontAwesomeIcon icon={faArrowLeft}/>
						</button>
						<button className={btnStyles} disabled={true}>
							Page {displayCurrentPage} of {totalPages}
						</button>
						<button className={btnStyles} disabled={nextBtnDisabled} onClick={onNextPageClick}>
							<FontAwesomeIcon icon={faArrowRight}/>
						</button>
					</div>
					<div className={bs.floatRight}>
						<input placeholder={"Search"} className={combine(bs.formControl, bs.formControlSm)}
							   onKeyUp={this.handleSearchTermChange}/>
					</div>
				</div>
		);
	}

	private handleSearchTermChange(event: React.KeyboardEvent) {
		const { onSearchTermSet } = this.props;
		clearTimeout(this.searchTermUpdateTimeout);
		const searchTerm = (event.target as HTMLInputElement).value;
		this.searchTermUpdateTimeout = global.setTimeout(() => onSearchTermSet(searchTerm), 200);
	}
}

export {
	DataTableOuterHeader,
};
