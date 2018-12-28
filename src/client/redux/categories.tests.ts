import { afterEach, beforeEach, describe, it } from "mocha";
import { DEFAULT_CATEGORY } from "../../api/models/ICategory";
import {
	CategoryActions,
	setCategoryList,
	setCategoryToEdit,
	setEditorBusy,
	startDeleteCategory,
	startLoadCategoryList,
	startSaveCategory,
} from "./categories";

describe(__filename, () => {

	describe("startDeleteCategory()", () => {

		it("should generate an action with the correct type", () => {
			startDeleteCategory(DEFAULT_CATEGORY).type.should.equal(CategoryActions.START_DELETE_CATEGORY);
		});

		it("should add the category to the payload", () => {
			startDeleteCategory(DEFAULT_CATEGORY).payload.should.have.keys("category");
			startDeleteCategory(DEFAULT_CATEGORY).payload.category.should.equal(DEFAULT_CATEGORY);
		});
	});

	describe("startSaveCategory()", () => {

		it("should generate an action with the correct type", () => {
			startSaveCategory(DEFAULT_CATEGORY).type.should.equal(CategoryActions.START_SAVE_CATEGORY);
		});

		it("should add the category to the payload", () => {
			startSaveCategory(DEFAULT_CATEGORY).payload.should.have.keys("category");
			startSaveCategory(DEFAULT_CATEGORY).payload.category.should.equal(DEFAULT_CATEGORY);
		});
	});

	describe("startLoadCategoryList()", () => {

		it("should generate an action with the correct type", () => {
			startLoadCategoryList().type.should.equal(CategoryActions.START_LOAD_CATEGORY_LIST);
		});
	});

	describe("setCategoryToEdit()", () => {

		it("should generate an action with the correct type", () => {
			setCategoryToEdit(DEFAULT_CATEGORY).type.should.equal(CategoryActions.SET_CATEGORY_TO_EDIT);
		});

		it("should add the category to the payload", () => {
			setCategoryToEdit(DEFAULT_CATEGORY).payload.should.have.keys("category");
			setCategoryToEdit(DEFAULT_CATEGORY).payload.category.should.equal(DEFAULT_CATEGORY);
		});
	});

	describe("setEditorBusy()", () => {

		it("should generate an action with the correct type", () => {
			setEditorBusy(true).type.should.equal(CategoryActions.SET_EDITOR_BUSY);
		});

		it("should add the value to the payload", () => {
			setEditorBusy(true).payload.should.have.keys("editorBusy");
			setEditorBusy(true).payload.editorBusy.should.equal(true);
		});
	});

	describe("setCategoryList()", () => {

		const categories = [DEFAULT_CATEGORY];

		it("should generate an action with the correct type", () => {
			setCategoryList(categories).type.should.equal(CategoryActions.SET_CATEGORY_LIST);
		});

		it("should add the categories to the payload", () => {
			setCategoryList(categories).payload.should.have.keys("categoryList");
			setCategoryList(categories).payload.categoryList.should.equal(categories);
		});
	});

	// TODO: reducer

	// TODO: sagas
});
