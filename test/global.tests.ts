import { ReactWrapper } from "enzyme";

const testGlobals = {
	mountWrapper: null as ReactWrapper,
};

afterEach(() => {
	if (testGlobals.mountWrapper) {
		try {
			testGlobals.mountWrapper.unmount();
		} catch (e) {
			// this is fine
		} finally {
			// this is fine
		}
	}
});

export {
	testGlobals,
};
