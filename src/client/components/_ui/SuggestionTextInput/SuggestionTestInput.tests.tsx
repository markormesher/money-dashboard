import { should } from "chai";
import { HTMLAttributes, mount, ReactWrapper } from "enzyme";
import { describe, it } from "mocha";
import * as React from "react";
import * as sinon from "sinon";
import { testGlobals } from "../../../../../test/global.tests";
import { UIConstants } from "../../_commons/ui-constants";
import { ControlledTextInput } from "../ControlledInputs/ControlledTextInput";
import { ISuggestionTextInputProps, SuggestionTextInput } from "./SuggestionTextInput";
import * as styles from "./SuggestionTextInput.scss";

describe(__filename, () => {

	let { mountWrapper } = testGlobals;

	const defaultProps: ISuggestionTextInputProps = {
		id: "test",
		label: "test",
		value: "",
		onValueChange: undefined,
	};

	const twelveOptions = [
		"aa", "ab", "ac", "ad", "ae", "af",
		"ag", "ah", "ai", "aj", "ak", "al",
	];

	function findInput(): ReactWrapper {
		return mountWrapper.find(ControlledTextInput);
	}

	function findInnerInput(): ReactWrapper<HTMLAttributes> {
		return mountWrapper.find("input");
	}

	function findSuggestionWrapper(): ReactWrapper<HTMLAttributes> {
		return mountWrapper.find("div").filterWhere((w) => w.props().className === styles.suggestionWrapper);
	}

	function findSuggestions(filter: (w: ReactWrapper<HTMLAttributes>) => boolean): ReactWrapper<HTMLAttributes> {
		return findSuggestionWrapper().find("li").filterWhere(filter);
	}

	it("should render as an input", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps}/>);
		findInput().length.should.equal(1);
	});

	it("should not render a drop down when there are no matches for the input", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["b"]}/>);
		findInput().simulate("change", { target: { value: "a" } });
		findSuggestionWrapper().length.should.equal(0);
	});

	it("should render a drop down when there are matches for the input", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a"]}/>);
		findInput().simulate("change", { target: { value: "a" } });
		findSuggestionWrapper().length.should.equal(0);
	});

	it("should only include suggestions that match the input", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a", "aa", "b"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		findSuggestions((w) => w.text() === "a").length.should.equal(1);
		findSuggestions((w) => w.text() === "aa").length.should.equal(1);
		findSuggestions((w) => w.text() === "b").length.should.equal(0);
	});

	it("should render at most 10 suggestions", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={twelveOptions}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		findSuggestions((w) => w.text().startsWith("a")).length.should.equal(10);
	});

	it("should render an overflow '...' with more than 10 suggestions", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={twelveOptions}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		findSuggestions((w) => w.text() === "...").length.should.equal(1);
	});

	it("should call the listener when a suggestion is clicked", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} onValueChange={spy} suggestionOptions={["aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		spy.resetHistory(); // ignore the change event from "typing"
		findSuggestions((w) => w.text() === "aa").simulate("mousedown");
		spy.calledOnceWithExactly("aa", "test").should.equal(true);
	});

	it("should highlight suggestions selected via the keyboard", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a", "aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });

		// nothing should be selected initially
		const blankSuggestion = findSuggestions((w) => w.props().className === styles.active);
		blankSuggestion.length.should.equal(0);

		// hitting "down" should select an item
		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
		const firstSuggestion = findSuggestions((w) => w.props().className === styles.active);
		firstSuggestion.length.should.equal(1);

		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
		const secondSuggestion = findSuggestions((w) => w.props().className === styles.active);
		secondSuggestion.length.should.equal(1);

		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.UP });
		const thirdSuggestion = findSuggestions((w) => w.props().className === styles.active);
		thirdSuggestion.length.should.equal(1);

		// selection should have changed then changed back
		firstSuggestion.text().should.not.equal(secondSuggestion.text());
		firstSuggestion.text().should.equal(thirdSuggestion.text());
	});

	it("should cap keyboard selections at the bottom of the list", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a", "aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });

		for (let i = 0; i < 20; ++i) {
			findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
		}
		findSuggestions((w) => w.props().className === styles.active).text().should.equal("aa");
	});

	it("should cap keyboard selections at the top of the list", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a", "aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });

		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
		for (let i = 0; i < 20; ++i) {
			findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.UP });
		}
		findSuggestions((w) => w.props().className === styles.active).text().should.equal("a");
	});

	it("should call the listener when a suggestion is selected via the keyboard", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} onValueChange={spy} suggestionOptions={["aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		spy.resetHistory(); // ignore the change event from "typing"
		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.ENTER });
		spy.calledOnceWithExactly("aa", "test").should.equal(true);
	});

	it("should not call the listener when ENTER is pressed but no selection is selected", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} onValueChange={spy} suggestionOptions={["aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		spy.resetHistory(); // ignore the change event from "typing"
		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.ENTER });
		spy.notCalled.should.equal(true);
	});

	it("should close the suggestions when the escape key is pressed", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} onValueChange={spy} suggestionOptions={["a"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		findSuggestionWrapper().length.should.equal(1);
		findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.ESC });
		findSuggestionWrapper().length.should.equal(0);
	});

	it("should close the suggestions when the input blurs", () => {
		const spy = sinon.spy();
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} onValueChange={spy} suggestionOptions={["a"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });
		findSuggestionWrapper().length.should.equal(1);
		findInnerInput().simulate("blur");
		findSuggestionWrapper().length.should.equal(0);
	});

	it("should preserve the highlighted suggestion when the input changes if it still matches", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a", "aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });

		// move down until we select the "aa" option
		let selectedSuggestion = findSuggestions((w) => w.props().className === styles.active);
		while (selectedSuggestion.length !== 1 || selectedSuggestion.text() !== "aa") {
			findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
			selectedSuggestion = findSuggestions((w) => w.props().className === styles.active);
		}
		findSuggestions((w) => w.props().className === styles.active).text().should.equal("aa");

		// change the input
		findInnerInput().simulate("change", { target: { value: "aa" } });

		// "aa" should still be highlighted
		findSuggestions((w) => w.props().className === styles.active).text().should.equal("aa");
	});

	it("should not preserve the highlighted suggestion when the input changes if it no longer matches", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["a", "aa"]}/>);
		findInnerInput().simulate("change", { target: { value: "a" } });

		// move down until we select the "aa" option
		let selectedSuggestion = findSuggestions((w) => w.props().className === styles.active);
		while (selectedSuggestion.length !== 1 || selectedSuggestion.text() !== "aa") {
			findInnerInput().simulate("keydown", { keyCode: UIConstants.keys.DOWN });
			selectedSuggestion = findSuggestions((w) => w.props().className === styles.active);
		}
		findSuggestions((w) => w.props().className === styles.active).text().should.equal("aa");

		// change the input
		findInnerInput().simulate("change", { target: { value: "b" } });

		// nothing should be highlighted
		findSuggestions((w) => w.props().className === styles.active).length.should.equal(0);
	});

	it("should highlight matching letters within suggestions", () => {
		mountWrapper = mount(<SuggestionTextInput {...defaultProps} suggestionOptions={["ab", "aba", "acb"]}/>);
		findInnerInput().simulate("change", { target: { value: "ab" } });

		let selectedSuggestion = findSuggestions((w) => w.text() === "ab");
		selectedSuggestion.find("span").length.should.equal(2);
		selectedSuggestion.find("span").at(0).text().should.equal("a");
		selectedSuggestion.find("span").at(1).text().should.equal("b");

		selectedSuggestion = findSuggestions((w) => w.text() === "aba");
		selectedSuggestion.find("span").length.should.equal(2);
		selectedSuggestion.find("span").at(0).text().should.equal("a");
		selectedSuggestion.find("span").at(1).text().should.equal("b");

		selectedSuggestion = findSuggestions((w) => w.text() === "acb");
		selectedSuggestion.find("span").length.should.equal(2);
		selectedSuggestion.find("span").at(0).text().should.equal("a");
		selectedSuggestion.find("span").at(1).text().should.equal("b");
	});
});
