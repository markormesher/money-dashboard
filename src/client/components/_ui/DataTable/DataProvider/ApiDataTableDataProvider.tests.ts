import { afterEach, describe, it } from "mocha";
import * as sinon from "sinon";
import { ApiDataTableDataProvider } from "./ApiDataTableDataProvider";

describe(__filename, () => {
  const sandbox = sinon.createSandbox();

  afterEach(() => {
    sandbox.restore();
  });

  it("should pass paging values to the API as query params", () => {
    new ApiDataTableDataProvider("api");
    // const provider = new ApiDataTableDataProvider("api");
    // TODO: tests
  });

  it("should pass the search term to the API as query params", () => {
    // const provider = new ApiDataTableDataProvider("api");
    // TODO: tests
  });

  it("should pass the search term as an empty string if not specified", () => {
    // const provider = new ApiDataTableDataProvider("api");
    // TODO: tests
  });

  it("should pass the column ordering to the API as query params", () => {
    // const provider = new ApiDataTableDataProvider("api");
    // TODO: tests
  });

  it("should pass the column ordering as an empty array if not specified", () => {
    // const provider = new ApiDataTableDataProvider("api");
    // TODO: tests
  });

  it("should use the API response mapper if specified", () => {
    // const provider = new ApiDataTableDataProvider("api");
    // TODO: tests
  });
});
