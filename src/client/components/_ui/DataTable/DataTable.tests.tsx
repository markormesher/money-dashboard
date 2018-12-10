import { expect } from "chai";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { ReactElement } from "react";
import { testGlobals } from "../../../../../test-utils/global.tests";
import { IDataTableResponse } from "../../../../server/helpers/datatable-helper";
import { BufferedTextInput } from "../BufferedTextInput/BufferedTextInput";
import { PagerBtns } from "../PagerBtns/PagerBtns";
import { IDataTableDataProvider } from "./DataProvider/IDataTableDataProvider";
import { DataTable, IColumn, IColumnSortEntry } from "./DataTable";
import { DataTableInnerHeader } from "./DataTableInnerHeader";
import { DataTableOuterFooter } from "./DataTableOuterFooter";
import { DataTableOuterHeader } from "./DataTableOuterHeader";

interface IMockData {
	readonly field1: string;
	readonly field2: string;
	readonly field3: string;
}

interface IMockDataOptions {
	readonly firstCallShouldFail?: boolean;
	readonly allCallsShouldFail?: boolean;
	readonly firstCallShouldBeDelayed?: boolean;
	readonly responseShouldBeEmpty?: boolean;
}

class MockDataProvider implements IDataTableDataProvider<IMockData> {

	public callCount = 0;
	public lastStart: number = undefined;
	public lastLength: number = undefined;
	public lastSearchTerm: string = undefined;
	public lastSortedColumns: IColumnSortEntry[] = undefined;

	private readonly firstCallShouldFail: boolean;
	private readonly allCallsShouldFail: boolean;
	private readonly firstCallShouldBeDelayed: boolean;
	private readonly responseShouldBeEmpty: boolean;

	constructor(options: IMockDataOptions = {}) {
		this.firstCallShouldFail = options.firstCallShouldFail || false;
		this.allCallsShouldFail = options.allCallsShouldFail || false;
		this.firstCallShouldBeDelayed = options.firstCallShouldBeDelayed || false;
		this.responseShouldBeEmpty = options.responseShouldBeEmpty || false;
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

		const shouldDelay = this.firstCallShouldBeDelayed && this.callCount === 1;
		const shouldFail = this.allCallsShouldFail || (this.firstCallShouldFail && this.callCount === 1);

		if (shouldFail) {
			return new Promise((_, reject) => {
				if (shouldDelay) {
					setTimeout(reject, 20);
				} else {
					reject();
				}
			});
		} else {
			return Promise
					.resolve({
						filteredRowCount: this.responseShouldBeEmpty ? 0 : 80,
						totalRowCount: this.responseShouldBeEmpty ? 0 : 100,
						data: this.responseShouldBeEmpty ? [] : [
							{ field1: shouldDelay ? "delayed1" : "a1", field2: "b1", field3: "c1" },
							{ field1: shouldDelay ? "delayed2" : "a2", field2: "b2", field3: "c2" },
						],
					})
					.then((val) => {
						if (shouldDelay) {
							return new Promise((resolve) => setTimeout(resolve, 20)).then(() => val);
						} else {
							return val;
						}
					});
		}
	}
}

const mockCol1: IColumn = { title: "col1", sortable: true };
const mockCol2: IColumn = { title: "col2", sortable: true };
const mockCol3: IColumn = { title: "col3", sortable: false };
const mockColumns = [mockCol1, mockCol2, mockCol3];

function mockRowRenderer(data: IMockData): ReactElement<void> {
	return (
			<tr key={data.field1}>
				<td>{data.field1}</td>
				<td>{data.field2}</td>
				<td>{data.field3}</td>
			</tr>
	);
}

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render headers and footers", () => {
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
				/>
		));
		mountWrapper.find(DataTableInnerHeader).should.have.lengthOf(1);
		mountWrapper.find(DataTableOuterHeader).should.have.lengthOf(1);
		mountWrapper.find(DataTableOuterFooter).should.have.lengthOf(1);
	});

	it("should pass simple props to headers and footers", () => {
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						pageSize={20}
				/>
		));
		const innerHeader = mountWrapper.find(DataTableInnerHeader);
		innerHeader.props().columns.should.deep.equal(mockColumns);
		const outerHeader = mountWrapper.find(DataTableOuterHeader);
		outerHeader.props().pageSize.should.equal(20);
		const outerFooter = mountWrapper.find(DataTableOuterFooter);
		outerFooter.props().pageSize.should.equal(20);
	});

	it("should pass row counts to headers and footers", (done) => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
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
	}).timeout(1000);

	it("should handle an empty response", (done) => {
		const mockProvider = new MockDataProvider({ responseShouldBeEmpty: true });
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
						pageSize={20}
				/>
		));
		setTimeout(() => {
			mountWrapper.update();
			const outerHeader = mountWrapper.find(DataTableOuterHeader);
			outerHeader.props().currentPage.should.equal(0);
			outerHeader.props().rowCount.should.equal(0);
			const outerFooter = mountWrapper.find(DataTableOuterFooter);
			outerFooter.props().currentPage.should.equal(0);
			outerFooter.props().filteredRowCount.should.equal(0);
			outerFooter.props().totalRowCount.should.equal(0);
			done();
		}, 30);
	}).timeout(1000);

	it("should render each row", (done) => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
				/>
		));

		setTimeout(() => {
			const html = mountWrapper.html();
			["a1", "b1", "c1", "a2", "b2", "c2"].forEach((val) => html.should.contain(val));
			done();
		}, 30);
	}).timeout(1000);

	it("should render a message when there is no data", (done) => {
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
				/>
		));

		setTimeout(() => {
			mountWrapper.html().should.contain("No rows");
			mountWrapper.find("td").length.should.equal(1);
			mountWrapper.find("td").props().colSpan.should.equal(mockColumns.length);
			done();
		}, 30);
	}).timeout(1000);

	it("should render a message when loading fails", (done) => {
		const mockProvider = new MockDataProvider({ allCallsShouldFail: true });
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
				/>
		));

		setTimeout(() => {
			mountWrapper.html().should.contain("Failed");
			mountWrapper.find("td").length.should.equal(1);
			mountWrapper.find("td").props().colSpan.should.equal(mockColumns.length);
			done();
		}, 30);
	}).timeout(1000);

	it("should call the data provider when it renders", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
				/>
		));
		mockProvider.callCount.should.be.greaterThan(0); // may be called more than once
	});

	it("should call the data provider when the page changes", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
				/>
		));
		const callCountBefore = mockProvider.callCount;
		mountWrapper.find(PagerBtns).props().onPageChange(1);
		mockProvider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should call the data provider when the search term changes", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
				/>
		));
		const callCountBefore = mockProvider.callCount;
		mountWrapper.find(BufferedTextInput).props().onValueChange("test");
		mockProvider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should call the data provider when the sort order changes", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
				/>
		));
		const callCountBefore = mockProvider.callCount;
		mountWrapper.find(DataTableInnerHeader).props().onSortOrderUpdate([{ column: mockCol1, dir: "ASC" }]);
		mockProvider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should call the data provider when watched props change", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
						watchedProps={{
							key: "old",
						}}
				/>
		));
		const callCountBefore = mockProvider.callCount;
		mountWrapper.setProps({ watchedProps: { key: "new" } });
		mockProvider.callCount.should.be.greaterThan(callCountBefore);
	});

	it("should not call the data provider when watched props are updated without changing", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
						watchedProps={{
							key: "old",
						}}
				/>
		));
		const callCountBefore = mockProvider.callCount;
		mountWrapper.setProps({ watchedProps: { key: "old" } });
		mockProvider.callCount.should.equal(callCountBefore);
	});

	it("should call the data provider with all details", () => {
		const mockProvider = new MockDataProvider();
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={mockRowRenderer}
						dataProvider={mockProvider}
						pageSize={2}
				/>
		));
		mountWrapper.find(PagerBtns).props().onPageChange(2);
		mountWrapper.find(BufferedTextInput).props().onValueChange("test");
		mountWrapper.find(DataTableInnerHeader).props().onSortOrderUpdate([{ column: mockCol1, dir: "ASC" }]);

		mockProvider.lastStart.should.equal(4);
		mockProvider.lastLength.should.equal(2);
		mockProvider.lastSearchTerm.should.equal("test");
		mockProvider.lastSortedColumns.should.deep.equal([{ column: mockCol1, dir: "ASC" }]);
	});

	it("should not render data that arrived late", (done) => {
		let didRenderDelayedFrame = false;
		const mockProvider = new MockDataProvider({ firstCallShouldBeDelayed: true });
		const delayRejectingRowRenderer: (data: IMockData) => ReactElement<void> = (data: IMockData) => {
			if (data.field1.startsWith("delayed")) {
				didRenderDelayedFrame = true;
			}
			return (<tr key={data.field2}/>);
		};
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={delayRejectingRowRenderer}
						dataProvider={mockProvider}
						watchedProps={{
							key: 1,
						}}
				/>
		));

		// make sure we trigger several requests
		mountWrapper.setProps({ watchedProps: { key: 2 } });
		mountWrapper.setProps({ watchedProps: { key: 3 } });
		mountWrapper.setProps({ watchedProps: { key: 4 } });

		setTimeout(() => {
			didRenderDelayedFrame.should.equal(false);
			done();
		}, 30);
	}).timeout(1000);

	it("should not render an error that arrived late", (done) => {
		let didRenderDelayedFrame = false;
		const mockProvider = new MockDataProvider({ firstCallShouldBeDelayed: true, firstCallShouldFail: true });
		const delayRejectingRowRenderer: (data: IMockData) => ReactElement<void> = (data: IMockData) => {
			if (data.field1.startsWith("delayed")) {
				didRenderDelayedFrame = true;
			}
			return (<tr key={data.field2}/>);
		};
		mountWrapper = mount((
				<DataTable<IMockData>
						columns={mockColumns}
						rowRenderer={delayRejectingRowRenderer}
						dataProvider={mockProvider}
						watchedProps={{
							key: 1,
						}}
				/>
		));

		// make sure we trigger several requests
		mountWrapper.setProps({ watchedProps: { key: 2 } });
		mountWrapper.setProps({ watchedProps: { key: 3 } });
		mountWrapper.setProps({ watchedProps: { key: 4 } });

		setTimeout(() => {
			didRenderDelayedFrame.should.equal(false);
			done();
		}, 30);
	}).timeout(1000);
});
