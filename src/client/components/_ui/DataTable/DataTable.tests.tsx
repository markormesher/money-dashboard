import { expect } from "chai";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { ReactElement } from "react";
import { testGlobals } from "../../../../../test/global.tests";
import { BufferedTextInput } from "../BufferedTextInput/BufferedTextInput";
import { PagerBtns } from "../PagerBtns/PagerBtns";
import { IDataTableDataProvider, IDataTableResponse } from "./DataProvider/IDataTableDataProvider";
import { DataTable, IColumn, IColumnSortEntry } from "./DataTable";
import { DataTableInnerHeader } from "./DataTableInnerHeader";
import { DataTableOuterFooter } from "./DataTableOuterFooter";
import { DataTableOuterHeader } from "./DataTableOuterHeader";

interface IMockData {
	readonly field1: string;
	readonly field2: string;
	readonly field3: string;
}

class MockDataProvider implements IDataTableDataProvider<IMockData> {

	public callCount = 0;
	public lastStart: number = undefined;
	public lastLength: number = undefined;
	public lastSearchTerm: string = undefined;
	public lastSortedColumns: IColumnSortEntry[] = undefined;

	private readonly shouldFail: boolean;
	private readonly shouldDelayFirstCall: boolean;

	constructor(shouldFail: boolean = false, shouldDelayFirstCall: boolean = false) {
		this.shouldFail = shouldFail;
		this.shouldDelayFirstCall = shouldDelayFirstCall;
	}

	public getData(
			start: number,
			length: number,
			searchTerm?: string,
			sortedColumns?: IColumnSortEntry[],
	): Promise<IDataTableResponse<IMockData>> {
		++this.callCount;
		this.lastStart = start;
		this.lastLength = length;
		this.lastSearchTerm = searchTerm;
		this.lastSortedColumns = sortedColumns;

		if (this.shouldFail) {
			return Promise.reject("error");
		} else {
			if (this.shouldDelayFirstCall && this.callCount === 1) {
				return Promise
						.resolve({
							filteredRowCount: 80,
							totalRowCount: 100,
							data: [
								{ field1: "delayed", field2: "b1", field3: "c1" },
								{ field1: "delayed", field2: "b2", field3: "c2" },
							],
						})
						.then((val) => {
							return new Promise((resolve) => {
								setTimeout(() => {
									resolve();
								}, 20);
							}).then(() => {
								return val;
							});
						});
			} else {
				return Promise
						.resolve({
							filteredRowCount: 80,
							totalRowCount: 100,
							data: [
								{ field1: "a1", field2: "b1", field3: "c1" },
								{ field1: "a2", field2: "b2", field3: "c2" },
							],
						});
			}
		}
	}
}

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	const col1: IColumn = { title: "col1", sortable: true };
	const col2: IColumn = { title: "col2", sortable: true };
	const col3: IColumn = { title: "col3", sortable: false };
	const columns = [col1, col2, col3];

	function tableRowRenderer(data: IMockData): ReactElement<void> {
		return (
				<tr key={data.field1}>
					<td>{data.field1}</td>
					<td>{data.field2}</td>
					<td>{data.field3}</td>
				</tr>
		);
	}

	it("should render headers and footers", () => {
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
				/>
		));
		mountWrapper.find(DataTableInnerHeader).should.have.lengthOf(1);
		mountWrapper.find(DataTableOuterHeader).should.have.lengthOf(1);
		mountWrapper.find(DataTableOuterFooter).should.have.lengthOf(1);
	});

	it("should pass simple props to headers and footers", () => {
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						pageSize={20}
				/>
		));
		const innerHeader = mountWrapper.find(DataTableInnerHeader);
		innerHeader.props().columns.should.deep.equal(columns);
		const outerHeader = mountWrapper.find(DataTableOuterHeader);
		outerHeader.props().pageSize.should.equal(20);
		const outerFooter = mountWrapper.find(DataTableOuterFooter);
		outerFooter.props().pageSize.should.equal(20);
	});

	it("should pass row counts to headers and footers", (done) => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
						pageSize={20}
				/>
		));
		setTimeout(() => {
			mountWrapper.update();
			const outerHeader = mountWrapper.find(DataTableOuterHeader);
			outerHeader.props().currentPage.should.equal(0);
			outerHeader.props().rowCount.should.equal(80);
			const outerFooter = mountWrapper.find(DataTableOuterFooter);
			outerFooter.props().currentPage.should.equal(0);
			outerFooter.props().filteredRowCount.should.equal(80);
			outerFooter.props().totalRowCount.should.equal(100);
			done();
		}, 30);
	}).timeout(60);

	it("should render each row", (done) => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
				/>
		));

		setTimeout(() => {
			const html = mountWrapper.html();
			["a1", "b1", "c1", "a2", "b2", "c2"].forEach((val) => html.should.contain(val));
			done();
		}, 30);
	}).timeout(60);

	it("should render a only message when there is no data", (done) => {
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
				/>
		));

		setTimeout(() => {
			mountWrapper.html().should.contain("No rows");
			mountWrapper.find("td").length.should.equal(1);
			mountWrapper.find("td").props().colSpan.should.equal(columns.length);
			done();
		}, 30);
	}).timeout(60);

	it("should render a only message when loading fails", (done) => {
		const provider = new MockDataProvider(true);
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
				/>
		));

		setTimeout(() => {
			mountWrapper.html().should.contain("Failed");
			mountWrapper.find("td").length.should.equal(1);
			mountWrapper.find("td").props().colSpan.should.equal(columns.length);
			done();
		}, 30);
	}).timeout(60);

	it("should call the data provider when it renders", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
				/>
		));
		provider.callCount.should.be.greaterThan(0); // may be called more than once
	});

	it("should call the data provider when the page changes", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
				/>
		));
		const callCountBefore = provider.callCount;
		mountWrapper.find(PagerBtns).props().onPageChange(1);
		provider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should call the data provider when the search term changes", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
				/>
		));
		const callCountBefore = provider.callCount;
		mountWrapper.find(BufferedTextInput).props().onValueChange("test");
		provider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should call the data provider when the sort order changes", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
				/>
		));
		const callCountBefore = provider.callCount;
		mountWrapper.find(DataTableInnerHeader).props().onSortOrderUpdate([{ column: col1, dir: "asc" }]);
		provider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should call the data provider when watched props change", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
						watchedProps={{
							key: "old",
						}}
				/>
		));
		const callCountBefore = provider.callCount;
		mountWrapper.setProps({ watchedProps: { key: "new" } });
		provider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should not call the data provider when watched props are updated without changing", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
						watchedProps={{
							key: "old",
						}}
				/>
		));
		const callCountBefore = provider.callCount;
		mountWrapper.setProps({ watchedProps: { key: "old" } });
		provider.callCount.should.equal(callCountBefore);
	});

	it("should call the data provider with all details", () => {
		const provider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={tableRowRenderer}
						dataProvider={provider}
						pageSize={2}
				/>
		));
		mountWrapper.find(PagerBtns).props().onPageChange(2);
		mountWrapper.find(BufferedTextInput).props().onValueChange("test");
		mountWrapper.find(DataTableInnerHeader).props().onSortOrderUpdate([{ column: col1, dir: "asc" }]);

		provider.lastStart.should.equal(4);
		provider.lastLength.should.equal(2);
		provider.lastSearchTerm.should.equal("test");
		provider.lastSortedColumns.should.deep.equal([{ column: col1, dir: "asc" }]);
	});

	it("should not render frames that arrived late", (done) => {
		let didRenderDelayedFrame = false;
		const provider = new MockDataProvider(false, true);
		const delayRejectingRowRenderer: (data: IMockData) => ReactElement<void> = (data: IMockData) => {
			if (data.field1 === "delayed") {
				didRenderDelayedFrame = true;
			}
			return (<tr key={data.field2}/>);
		};
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={columns}
						rowRenderer={delayRejectingRowRenderer}
						dataProvider={provider}
						pageSize={2}
				/>
		));

		// make sure we trigger several requests
		mountWrapper.find(PagerBtns).props().onPageChange(2);
		mountWrapper.find(BufferedTextInput).props().onValueChange("test");
		mountWrapper.find(DataTableInnerHeader).props().onSortOrderUpdate([{ column: col1, dir: "asc" }]);

		setTimeout(() => {
			didRenderDelayedFrame.should.equal(false);
			done();
		}, 30);
	}).timeout(60);
});
