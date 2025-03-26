import React from "react";
import { Account } from "../../api_gen/moneydashboard/v4/accounts_pb.js";
import { useAsyncEffect, WaitGroup } from "../utils/hooks.js";
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
import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";
import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";
import { Holding } from "../../api_gen/moneydashboard/v4/holdings_pb.js";
import { Category } from "../../api_gen/moneydashboard/v4/categories_pb.js";
import { Rate } from "../../api_gen/moneydashboard/v4/rates_pb.js";
import { Profile } from "../../api_gen/moneydashboard/v4/profiles_pb.js";
import { AccountGroup } from "../../api_gen/moneydashboard/v4/account_groups_pb.js";
import { NULL_UUID } from "../../config/consts.js";
import { Envelope } from "../../api_gen/moneydashboard/v4/envelopes_pb.js";
import { EnvelopeAllocation } from "../../api_gen/moneydashboard/v4/envelope_allocations_pb.js";

type UseListOptions = {
  wg?: WaitGroup;
  dependencies?: React.DependencyList;
  onError: (error: unknown) => void;
};

function useAccountList(options: UseListOptions): Account[] | undefined {
  const [accounts, setAccounts] = React.useState<Account[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await accountServiceClient.getAllAccounts({});
      setAccounts(res.accounts);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return accounts;
}

function useAccountGroupList(options: UseListOptions): AccountGroup[] | undefined {
  const [accountGroups, setAccountGroups] = React.useState<AccountGroup[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await accountGroupServiceClient.getAllAccountGroups({});
      setAccountGroups(res.accountGroups);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return accountGroups;
}

function useAssetList(options: UseListOptions): Asset[] | undefined {
  const [assets, setAssets] = React.useState<Asset[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await assetServiceClient.getAllAssets({});
      setAssets(res.assets);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return assets;
}

function useCategoryList(options: UseListOptions): Category[] | undefined {
  const [categories, setCategories] = React.useState<Category[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await categoryServiceClient.getAllCategories({});
      setCategories(res.categories);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return categories;
}

function useCurrencyList(options: UseListOptions): Currency[] | undefined {
  const [currencies, setCurrencies] = React.useState<Currency[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await currencyServiceClient.getAllCurrencies({});
      setCurrencies(res.currencies);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return currencies;
}

function useEnvelopeList(options: UseListOptions): Envelope[] | undefined {
  const [envelopes, setEnvelopes] = React.useState<Envelope[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await envelopeServiceClient.getAllEnvelopes({});
      setEnvelopes(res.envelopes);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return envelopes;
}

function useEnvelopeAllocationList(options: UseListOptions): EnvelopeAllocation[] | undefined {
  const [envelopeAllocations, setEnvelopeAllocations] = React.useState<EnvelopeAllocation[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await envelopeAllocationServiceClient.getAllEnvelopeAllocations({});
      setEnvelopeAllocations(res.envelopeAllocations);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return envelopeAllocations;
}

function useHoldingList(options: UseListOptions): Holding[] | undefined {
  const [holdings, setHoldings] = React.useState<Holding[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await holdingServiceClient.getAllHoldings({});
      setHoldings(res.holdings);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return holdings;
}

function usePayeeList(options: UseListOptions): string[] | undefined {
  const [payees, setPayees] = React.useState<string[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await transactionServiceClient.getPayees({});
      setPayees(res.payees);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return payees;
}

function useProfileList(options: UseListOptions): Profile[] | undefined {
  const [profiles, setProfiles] = React.useState<Profile[]>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await profileServiceClient.getAllProfiles({});
      setProfiles(res.profiles);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);

  return profiles;
}

function useLatestRates(options: UseListOptions): Record<string, Rate> | undefined {
  const [rates, setRates] = React.useState<Record<string, Rate>>();
  useAsyncEffect(async () => {
    options.wg?.add();
    try {
      const res = await rateServiceClient.getLatestRates({});
      const rates: Record<string, Rate> = {};
      res.rates.forEach((r) => {
        if (r.currencyId != NULL_UUID) {
          rates[r.currencyId] = r;
        }
        if (r.assetId != NULL_UUID) {
          rates[r.assetId] = r;
        }
      });
      setRates(rates);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg?.done();
  }, options.dependencies ?? []);
  return rates;
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
};
