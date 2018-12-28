import { mount } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import { testGlobals } from "../../../../test-utils/global.tests";
import { LoadingSpinner } from "../LoadingSpinner/LoadingSpinner";
import { FullPageSpinner } from "./FullPageSpinner";
import * as styles from "./FullPageSpinner.scss";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	it("should render the spinner in a wrapper", () => {
		mountWrapper = mount(<FullPageSpinner/>);
		mountWrapper.find(LoadingSpinner).length.should.equal(1);
		mountWrapper.find("div").length.should.equal(1);
		mountWrapper.find("div").props().className.should.equal(styles.spinnerWrapper);
	});
});
