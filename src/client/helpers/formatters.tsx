import * as React from "react";
import { ReactNode } from "react";
import * as bs from "../bootstrap-aliases";
import { combine } from "./style-helpers";

function generateBadge(content: string, badgeClass?: string): ReactNode {
	badgeClass = badgeClass || bs.badgeLight;
	return (<span className={combine(bs.badge, badgeClass)}>{content}</span>);
}

// accounts

// TODO: make account type into strict type
function generateAccountTypeBadge(type: string): ReactNode {
	switch (type) {
		case "current":
			return generateBadge("Current Account", bs.badgeInfo);
		case "savings":
			return generateBadge("Savings Account", bs.badgeSuccess);
		case "asset":
			return generateBadge("Asset", bs.badgeWarning);
		default:
			return generateBadge("Other", bs.badgeDanger);
	}
}

export {
	generateBadge,
	generateAccountTypeBadge,
};
