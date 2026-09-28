import React from "react";
import type { Account } from "../../api_gen/moneydashboard/v4/accounts_pb.js";
import {
	accountGroupServiceClient,
	accountServiceClient,
	assetServiceClient,
	categoryServiceClient,
	currencyServiceClient,
	envelopeAllocationServiceClient,
	envelopeServiceClient,
	holdingServiceClient,
	profileServiceClient,
	rateServiceClient,
	transactionServiceClient,
} from "../../api/api.js";
import type { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";
import type { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";
import type { Holding } from "../../api_gen/moneydashboard/v4/holdings_pb.js";
import type { Category } from "../../api_gen/moneydashboard/v4/categories_pb.js";
import type { Rate } from "../../api_gen/moneydashboard/v4/rates_pb.js";
import type { Profile } from "../../api_gen/moneydashboard/v4/profiles_pb.js";
import type { AccountGroup } from "../../api_gen/moneydashboard/v4/account_groups_pb.js";
import { NULL_UUID } from "../../config/consts.js";
import type { Envelope } from "../../api_gen/moneydashboard/v4/envelopes_pb.js";
import type { EnvelopeAllocation } from "../../api_gen/moneydashboard/v4/envelope_allocations_pb.js";
import type { WaitGroupAdd, WaitGroupDone } from "../utils/hooks.js";

type UseListOptions = {
	wgAdd?: WaitGroupAdd;
	wgDone?: WaitGroupDone;
	nudgeValue?: number;
	onError: (error: unknown) => void;
};

function useList<T, V>(options: UseListOptions, fetcher: () => Promise<V>, getter: (res: V) => T): T | undefined {
	const [out, setOut] = React.useState<T>();

	React.useEffect(() => {
		// "consume" the nudge value to make sure the linter keeps it as a dependency of this effect
		void options.nudgeValue;

		options.wgAdd?.();
		fetcher()
			.then((res) => {
				setOut(getter(res));
			})
			.catch((e) => {
				options.onError(e);
				console.log(e);
			})
			.finally(() => {
				options.wgDone?.();
			});
	}, [options.nudgeValue, options.wgAdd, options.wgDone, options.onError, fetcher, getter]);

	return out;
}

function useAccountList(options: UseListOptions): Account[] | undefined {
	return useList(
		options,
		React.useCallback(() => accountServiceClient.getAllAccounts({}), []),
		React.useCallback((res) => res.accounts, []),
	);
}

function useAccountGroupList(options: UseListOptions): AccountGroup[] | undefined {
	return useList(
		options,
		React.useCallback(() => accountGroupServiceClient.getAllAccountGroups({}), []),
		React.useCallback((res) => res.accountGroups, []),
	);
}

function useAssetList(options: UseListOptions): Asset[] | undefined {
	return useList(
		options,
		React.useCallback(() => assetServiceClient.getAllAssets({}), []),
		React.useCallback((res) => res.assets, []),
	);
}

function useCategoryList(options: UseListOptions): Category[] | undefined {
	return useList(
		options,
		React.useCallback(() => categoryServiceClient.getAllCategories({}), []),
		React.useCallback((res) => res.categories, []),
	);
}

function useCurrencyList(options: UseListOptions): Currency[] | undefined {
	return useList(
		options,
		React.useCallback(() => currencyServiceClient.getAllCurrencies({}), []),
		React.useCallback((res) => res.currencies, []),
	);
}

function useEnvelopeList(options: UseListOptions): Envelope[] | undefined {
	return useList(
		options,
		React.useCallback(() => envelopeServiceClient.getAllEnvelopes({}), []),
		React.useCallback((res) => res.envelopes, []),
	);
}

function useEnvelopeAllocationList(options: UseListOptions): EnvelopeAllocation[] | undefined {
	return useList(
		options,
		React.useCallback(() => envelopeAllocationServiceClient.getAllEnvelopeAllocations({}), []),
		React.useCallback((res) => res.envelopeAllocations, []),
	);
}

function useHoldingList(options: UseListOptions): Holding[] | undefined {
	return useList(
		options,
		React.useCallback(() => holdingServiceClient.getAllHoldings({}), []),
		React.useCallback((res) => res.holdings, []),
	);
}

function usePayeeList(options: UseListOptions): string[] | undefined {
	return useList(
		options,
		React.useCallback(() => transactionServiceClient.getPayees({}), []),
		React.useCallback((res) => res.payees, []),
	);
}

function useProfileList(options: UseListOptions): Profile[] | undefined {
	return useList(
		options,
		React.useCallback(() => profileServiceClient.getAllProfiles({}), []),
		React.useCallback((res) => res.profiles, []),
	);
}

function useLatestRates(options: UseListOptions): Record<string, Rate> | undefined {
	return useList(
		options,
		React.useCallback(() => rateServiceClient.getLatestRates({}), []),
		React.useCallback((res) => {
			const rates: Record<string, Rate> = {};
			res.rates.forEach((r) => {
				if (r.currencyId !== NULL_UUID) {
					rates[r.currencyId] = r;
				}
				if (r.assetId !== NULL_UUID) {
					rates[r.assetId] = r;
				}
			});
			return rates;
		}, []),
	);
}

function useHistoricAverageRates(options: UseListOptions): Record<string, Rate> | undefined {
	return useList(
		options,
		React.useCallback(() => rateServiceClient.getHistoricAverageRates({}), []),
		React.useCallback((res) => {
			const rates: Record<string, Rate> = {};
			res.rates.forEach((r) => {
				if (r.currencyId !== NULL_UUID) {
					rates[r.currencyId] = r;
				}
				if (r.assetId !== NULL_UUID) {
					rates[r.assetId] = r;
				}
			});
			return rates;
		}, []),
	);
}

export {
	useAccountList,
	useAccountGroupList,
	useAssetList,
	useCategoryList,
	useCurrencyList,
	useHoldingList,
	useEnvelopeList,
	useEnvelopeAllocationList,
	usePayeeList,
	useProfileList,
	useLatestRates,
	useHistoricAverageRates,
};
