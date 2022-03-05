import { expect } from "chai";
import { describe, it } from "mocha";
import { IExchangeRate } from "../../models/IExchangeRate";
import {
  startLoadLatestExchangeRates,
  ExchangeRateActions,
  setLatestExchangeRates,
  exchangeRatesReducer,
} from "./exchange-rates";

const rate: IExchangeRate = {
  currencyCode: "GBP",
  ratePerGbp: 1,
  date: 0,
  updateTime: 0,
};

const rateMap = {
  GBP: rate,
};

describe(__filename, () => {
  describe("startLoadLatestExchangeRates()", () => {
    it("should generate an action with the correct type", () => {
      startLoadLatestExchangeRates().type.should.equal(ExchangeRateActions.START_LOAD_LATEST_EXCHANGE_RATES);
    });
  });

  describe("setLatestExchangeRates()", () => {
    it("should generate an action with the correct type", () => {
      setLatestExchangeRates(rateMap).type.should.equal(ExchangeRateActions.SET_LATEST_EXCHANGE_RATES);
    });

    it("should add the rates to the payload", () => {
      setLatestExchangeRates(rateMap).payload.should.have.keys("latestExchangeRates");
      setLatestExchangeRates(rateMap).payload.latestExchangeRates.should.equal(rateMap);
    });
  });

  describe("exchangeRatesReducer()", () => {
    it("should initialise its state correctly", () => {
      exchangeRatesReducer(undefined, { type: "@@INIT" }).should.deep.equal({
        latestExchangeRates: undefined,
      });
    });

    describe(ExchangeRateActions.SET_LATEST_EXCHANGE_RATES, () => {
      it("should set the latest rates", () => {
        expect(exchangeRatesReducer(undefined, setLatestExchangeRates(rateMap)).latestExchangeRates).to.equal(rateMap);
      });
    });
  });

  // TODO: sagas
});
