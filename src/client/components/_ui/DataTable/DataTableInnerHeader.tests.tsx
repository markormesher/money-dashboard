import { faExchange, faSortAmountDown, faSortAmountUp } from "@fortawesome/pro-light-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { expect } from "chai";
import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { IColumn, IColumnSortEntry } from "./DataTable";
import { DataTableInnerHeader } from "./DataTableInnerHeader";

const col1: IColumn = { title: "col1", sortable: true };
const col2: IColumn = { title: "col2", sortable: true };
const col3: IColumn = { title: "col3", sortable: false };

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render a header for each column", () => {
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1, col2]}
					/>
				</table>
		));
		mountWrapper.find("thead").should.have.lengthOf(1);
		mountWrapper.find("tr").should.have.lengthOf(1);
		mountWrapper.find("th").should.have.lengthOf(2);
	});

	it("should render a sort icon for sortable columns only", () => {
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1, col2, col3]}
					/>
				</table>
		));
		mountWrapper.find(FontAwesomeIcon).should.have.lengthOf(2);
	});

	it("should render an 'small to big' icon for ASC sorted", () => {
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
							sortedColumns={[{ column: col1, dir: "ASC" }]}
					/>
				</table>
		));
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faSortAmountUp);
		mountWrapper.find(FontAwesomeIcon).props().flip.should.equal("vertical");
		expect(mountWrapper.find(FontAwesomeIcon).props().rotation).to.be.oneOf([undefined, null]);
	});

	it("should render a 'big to small' icon for desc sorted", () => {
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
							sortedColumns={[{ column: col1, dir: "DESC" }]}
					/>
				</table>
		));
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faSortAmountDown);
		expect(mountWrapper.find(FontAwesomeIcon).props().flip).to.be.oneOf([undefined, null]);
		expect(mountWrapper.find(FontAwesomeIcon).props().rotation).to.be.oneOf([undefined, null]);
	});

	it("should render a 'swap' icon for non-sorted", () => {
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
					/>
				</table>
		));
		mountWrapper.find(FontAwesomeIcon).props().icon.should.equal(faExchange);
		expect(mountWrapper.find(FontAwesomeIcon).props().flip).to.be.oneOf([undefined, null]);
		mountWrapper.find(FontAwesomeIcon).props().rotation.should.equal(90);
	});

	it("should call the listener with a different sort order when a sortable column is clicked", () => {
		const spy = sinon.spy();
		const originalSortOrder: IColumnSortEntry[] = [{ column: col1, dir: "ASC" }];
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
							sortedColumns={originalSortOrder}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").simulate("click");
		spy.calledOnce.should.equal(true);
		spy.firstCall.args[0].length.should.equal(1);
		spy.firstCall.args[0].should.not.deep.equal(originalSortOrder);
	});

	it("should not call the listener when a non-sortable column is clicked", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col3]}
							sortedColumns={[]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").simulate("click");
		spy.notCalled.should.equal(true);
	});

	it("should determine the correct default sort order", () => {
		const col1WithSort: IColumn = { ...col1, defaultSortDirection: "ASC", defaultSortPriority: 1 };
		const col2WithSort: IColumn = { ...col2, defaultSortDirection: "DESC", defaultSortPriority: 0 };
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1WithSort, col2WithSort, col3]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		spy.lastCall.args[0].should.deep.equal([
			{ column: col2WithSort, dir: "DESC" },
			{ column: col1WithSort, dir: "ASC" },
		]);
	});

	it("should determine the correct next sort order for a single column (none -> ASC)", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
							sortedColumns={[]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").simulate("click");
		spy.lastCall.args[0].should.deep.equal([{ column: col1, dir: "ASC" }]);
	});

	it("should determine the correct next sort order for a single column (ASC -> desc)", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
							sortedColumns={[{ column: col1, dir: "ASC" }]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").simulate("click");
		spy.lastCall.args[0].should.deep.equal([{ column: col1, dir: "DESC" }]);
	});

	it("should determine the correct next sort order for a single column (desc -> none)", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1]}
							sortedColumns={[{ column: col1, dir: "DESC" }]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").simulate("click");
		spy.lastCall.args[0].should.deep.equal([]);
	});

	it("should add new sorted columns at the beginning of the sort order", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1, col2]}
							sortedColumns={[{ column: col1, dir: "DESC" }]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").at(1).simulate("click");
		spy.lastCall.args[0].should.deep.equal([{ column: col2, dir: "ASC" }, { column: col1, dir: "DESC" }]);
	});

	it("should remove unsorted columns from the sort order", () => {
		const spy = sinon.spy();
		mountWrapper = mount((
				<table>
					<DataTableInnerHeader
							columns={[col1, col2]}
							sortedColumns={[{ column: col2, dir: "ASC" }, { column: col1, dir: "DESC" }]}
							onSortOrderUpdate={spy}
					/>
				</table>
		));
		mountWrapper.find("th").at(0).simulate("click");
		spy.lastCall.args[0].should.deep.equal([{ column: col2, dir: "ASC" }]);
	});
});
