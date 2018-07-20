import { updateChart } from "./graph";

const assetSelectorWrapper = $("#asset-selector");
const dropdownBtnLabel = assetSelectorWrapper.find("button span");
const dropdownOptions = assetSelectorWrapper.find("a");
let selected: string = null;

function initDropdown() {
	dropdownOptions.on("click", function (evt) {
		evt.preventDefault();
		setSelectedAsset($(this).data("id"), $(this).data("name"));
	});
}

function selectFirstAsset() {
	dropdownOptions.first().trigger("click");
}

function setSelectedAsset(id: string, name: string) {
	selected = id;
	dropdownBtnLabel.html(name);
	updateChart()
}

function getSelectedAssetId(): string {
	return selected;
}

$(() => {
	initDropdown();
	selectFirstAsset();
});

export {
	getSelectedAssetId,
};
