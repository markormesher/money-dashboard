import React from "react";
import { Account } from "../../api_gen/moneydashboard/v4/accounts_pb.js";
import { useAsyncEffect, WaitGroup } from "../utils/hooks.js";
import { accountServiceClient, assetServiceClient, currencyServiceClient } from "../../api/api.js";
import { Asset } from "../../api_gen/moneydashboard/v4/assets_pb.js";
import { Currency } from "../../api_gen/moneydashboard/v4/currencies_pb.js";

type UseListOptions = {
  wg: WaitGroup;
  onError: (error: unknown) => void;
};

function useAccountList(options: UseListOptions): Account[] | undefined {
  const [accounts, setAccounts] = React.useState<Account[]>();
  useAsyncEffect(async () => {
    options.wg.add();
    try {
      const res = await accountServiceClient.getAllAccounts({});
      setAccounts(res.accounts);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg.done();
  }, []);

  return accounts;
}

function useAssetList(options: UseListOptions): Asset[] | undefined {
  const [assets, setAssets] = React.useState<Asset[]>();
  useAsyncEffect(async () => {
    options.wg.add();
    try {
      const res = await assetServiceClient.getAllAssets({});
      setAssets(res.assets);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg.done();
  }, []);

  return assets;
}

function useCurrencyList(options: UseListOptions): Currency[] | undefined {
  const [currencies, setCurrencies] = React.useState<Currency[]>();
  useAsyncEffect(async () => {
    options.wg.add();
    try {
      const res = await currencyServiceClient.getAllCurrencies({});
      setCurrencies(res.currencies);
    } catch (e) {
      options.onError(e);
      console.log(e);
    }
    options.wg.done();
  }, []);

  return currencies;
}

export { useAccountList, useAssetList, useCurrencyList };
