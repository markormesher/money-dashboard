import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import { IColumn } from "./DataTable";
import { DataTableOuterFooter } from "./DataTableOuterFooter";

const col1: IColumn = { title: "col1" };
const col2: IColumn = { title: "col2" };
const col3: IColumn = { title: "col3" };

describe(__filename, () => {
  let { mountWrapper } = testGlobals;

  it("should show record range on page 1", () => {
    mountWrapper = mount(
      <DataTableOuterFooter pageSize={10} currentPage={0} filteredRowCount={10} totalRowCount={10} />,
    );
    mountWrapper.text().should.contain("rows 1 to 10");
  });

  it("should show record range on page n", () => {
    mountWrapper = mount(
      <DataTableOuterFooter pageSize={10} currentPage={2} filteredRowCount={30} totalRowCount={30} />,
    );
    mountWrapper.text().should.contain("rows 21 to 30");
  });

  it("should show accurate record range when page isn't full", () => {
    mountWrapper = mount(<DataTableOuterFooter pageSize={10} currentPage={0} filteredRowCount={5} totalRowCount={5} />);
    mountWrapper.text().should.contain("rows 1 to 5");
  });

  it("should show one count when total === filtered", () => {
    mountWrapper = mount(
      <DataTableOuterFooter pageSize={10} currentPage={0} filteredRowCount={25} totalRowCount={25} />,
    );
    mountWrapper.text().should.contain("of 25");
    mountWrapper.text().should.not.contain("filtered");
  });

  it("should show total and filtered counts when total !== filtered", () => {
    mountWrapper = mount(
      <DataTableOuterFooter pageSize={10} currentPage={0} filteredRowCount={25} totalRowCount={50} />,
    );
    mountWrapper.text().should.contain("of 25");
    mountWrapper.text().should.contain("filtered from 50");
  });

  it("should not show sort order when undefined", () => {
    mountWrapper = mount(<DataTableOuterFooter pageSize={1} currentPage={0} filteredRowCount={1} totalRowCount={1} />);
    mountWrapper.text().should.not.containIgnoreCase("sorted");
  });

  it("should not show sort order when empty", () => {
    mountWrapper = mount(
      <DataTableOuterFooter pageSize={1} currentPage={0} filteredRowCount={1} totalRowCount={1} sortedColumns={[]} />,
    );
    mountWrapper.text().should.not.containIgnoreCase("sorted");
  });

  it("should show sort order for one column", () => {
    mountWrapper = mount(
      <DataTableOuterFooter
        pageSize={1}
        currentPage={0}
        filteredRowCount={1}
        totalRowCount={1}
        sortedColumns={[{ column: col1, dir: "ASC" }]}
      />,
    );
    mountWrapper.text().should.containIgnoreCase("sorted by col1 ascending");
  });

  it("should show sort order for multiple columns", () => {
    mountWrapper = mount(
      <DataTableOuterFooter
        pageSize={1}
        currentPage={0}
        filteredRowCount={1}
        totalRowCount={1}
        sortedColumns={[
          { column: col1, dir: "ASC" },
          { column: col2, dir: "DESC" },
          { column: col3, dir: "ASC" },
        ]}
      />,
    );
    mountWrapper.text().should.containIgnoreCase("sorted by col1 ascending, then col2 descending, then col3 ascending");
  });
});
