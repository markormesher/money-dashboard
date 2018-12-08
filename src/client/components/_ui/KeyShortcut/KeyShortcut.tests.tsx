import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../../test/global.tests";
import { voidListener } from "../../../../../test/test-helpers";
import { KeyShortcut } from "./KeyShortcut";

describe(__filename, () => {

	// TODO: tests

	let { mountWrapper } = testGlobals;

	it("mock test", () => {
		mountWrapper = mount(<KeyShortcut targetStr={"a"} onTrigger={voidListener}/>);
	});
});
