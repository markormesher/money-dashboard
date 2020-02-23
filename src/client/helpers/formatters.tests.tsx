import { expect } from "chai";
import { shallow } from "enzyme";
import { describe, it } from "mocha";
import * as Moment from "moment";
import { DEFAULT_ACCOUNT } from "../../commons/models/IAccount";
import { DEFAULT_BUDGET } from "../../commons/models/IBudget";
import { DEFAULT_CATEGORY } from "../../commons/models/ICategory";
import * as bs from "../global-styles/Bootstrap.scss";
import {
  capitaliseFirstLetter,
  formatBudgetPeriod,
  formatCurrency,
  formatCurrencyStyled,
  formatDate,
  formatPercent,
  generateAccountTypeBadge,
  generateBudgetTypeBadge,
  generateCategoryTypeBadge,
  getBudgetPeriodType,
} from "./formatters";

describe(__filename, () => {
  describe("formatCurrency()", () => {
    it("should force two decimal places", () => {
      formatCurrency(0).should.endsWith(".00");
      formatCurrency(0.5).should.endsWith(".50");
      formatCurrency(0.001).should.endsWith(".00");
    });

    it("should group thousands", () => {
      formatCurrency(1).should.equal("1.00");
      formatCurrency(1000).should.equal("1,000.00");
      formatCurrency(1000000).should.equal("1,000,000.00");
    });

    it("should preserve negatives", () => {
      formatCurrency(1).should.equal("1.00");
      formatCurrency(-1).should.equal("-1.00");
    });
  });

  describe("formatCurrencyStyled()", () => {
    it("should wrap the value", () => {
      const formattedElement = shallow(formatCurrencyStyled(0));
      formattedElement.find("span").should.have.lengthOf(1);
    });

    it("should apply the currency style", () => {
      const formattedElement = shallow(formatCurrencyStyled(0));
      formattedElement.html().should.contain("_currency_");
    });

    it("should preserve the un-styled value", () => {
      const formattedElement = shallow(formatCurrencyStyled(1234.56));
      formattedElement.text().should.equal("1,234.56");
    });
  });

  describe("formatPercent()", () => {
    it("should force two decimal places", () => {
      formatPercent(0).should.endsWith(".00%");
      formatPercent(0.5).should.endsWith(".50%");
      formatPercent(0.001).should.endsWith(".00%");
    });

    it("should preserve negatives", () => {
      formatPercent(1).should.equal("1.00%");
      formatPercent(-1).should.equal("-1.00%");
    });
  });

  describe("formatDate()", () => {
    it("should return undefined when called with undefined", () => {
      expect(formatDate(undefined, "user")).to.equal(undefined);
      expect(formatDate(undefined, "system")).to.equal(undefined);
    });

    it("should accept string dates", () => {
      formatDate("2015-04-01", "system").should.equal("2015-04-01");
    });

    it("should accept JS dates", () => {
      // note: months are 0-indexed
      formatDate(new Date(2015, 3, 1), "system").should.equal("2015-04-01");
    });

    it("should accept MomentJS dates", () => {
      // note: months are 0-indexed
      formatDate(Moment([2015, 3, 1]), "system").should.equal("2015-04-01");
    });

    it("should be able to format for users", () => {
      formatDate(Moment("2015-04-01"), "user").should.equal("01 Apr 2015");
    });
  });

  describe("capitaliseFirstLetter()", () => {
    it("should handle empty strings", () => {
      expect(capitaliseFirstLetter(undefined)).to.equal(undefined);
    });

    it("should handle empty strings", () => {
      capitaliseFirstLetter("").should.equal("");
    });

    it("should handle 1-char strings", () => {
      capitaliseFirstLetter("a").should.equal("A");
    });

    it("should handle multi-char strings", () => {
      capitaliseFirstLetter("hello").should.equal("Hello");
    });

    it("should not modify other characters", () => {
      capitaliseFirstLetter("HELLO").should.equal("HELLO");
    });
  });

  describe("generateAccountTypeBadge()", () => {
    it("should apply the right class for each account type", () => {
      let account = DEFAULT_ACCOUNT;

      account = { ...account, type: "current" };
      let badge = generateAccountTypeBadge(account);
      shallow(badge)
        .find(`.${bs.badgeInfo}`)
        .should.have.lengthOf(1);

      account = { ...account, type: "savings" };
      badge = generateAccountTypeBadge(account);
      shallow(badge)
        .find(`.${bs.badgeSuccess}`)
        .should.have.lengthOf(1);

      account = { ...account, type: "asset" };
      badge = generateAccountTypeBadge(account);
      shallow(badge)
        .find(`.${bs.badgeWarning}`)
        .should.have.lengthOf(1);

      account = { ...account, type: "other" };
      badge = generateAccountTypeBadge(account);
      shallow(badge)
        .find(`.${bs.badgeDanger}`)
        .should.have.lengthOf(1);
    });

    it("should insert the right text for each account type", () => {
      let account = DEFAULT_ACCOUNT;

      account = { ...account, type: "current" };
      let badge = generateAccountTypeBadge(account);
      shallow(badge)
        .text()
        .should.equal("Current Account");

      account = { ...account, type: "savings" };
      badge = generateAccountTypeBadge(account);
      shallow(badge)
        .text()
        .should.equal("Savings Account");

      account = { ...account, type: "asset" };
      badge = generateAccountTypeBadge(account);
      shallow(badge)
        .text()
        .should.equal("Asset");

      account = { ...account, type: "other" };
      badge = generateAccountTypeBadge(account);
      shallow(badge)
        .text()
        .should.equal("Other");
    });
  });

  describe("generateBudgetTypeBadge()", () => {
    it("should apply the right class for each budget type", () => {
      let budget = DEFAULT_BUDGET;

      budget = { ...budget, type: "budget" };
      let badge = generateBudgetTypeBadge(budget);
      shallow(badge)
        .find(`.${bs.badgeInfo}`)
        .should.have.lengthOf(1);

      budget = { ...budget, type: "bill" };
      badge = generateBudgetTypeBadge(budget);
      shallow(badge)
        .find(`.${bs.badgeWarning}`)
        .should.have.lengthOf(1);
    });

    it("should insert the right text for each budget type", () => {
      let budget = DEFAULT_BUDGET;

      budget = { ...budget, type: "budget" };
      let badge = generateBudgetTypeBadge(budget);
      shallow(badge)
        .text()
        .should.equal("Budget");

      budget = { ...budget, type: "bill" };
      badge = generateBudgetTypeBadge(budget);
      shallow(badge)
        .text()
        .should.equal("Bill");
    });
  });

  describe("getBudgetPeriodType()", () => {
    it("should determine month periods", () => {
      getBudgetPeriodType(Moment("2018-01-01"), Moment("2018-01-31")).should.equal("month");
      getBudgetPeriodType(Moment("2018-02-01"), Moment("2018-02-28")).should.equal("month");
    });

    it("should determine calendar year periods", () => {
      getBudgetPeriodType(Moment("2018-01-01"), Moment("2018-12-31")).should.equal("calendar year");
    });

    it("should determine tax year periods", () => {
      getBudgetPeriodType(Moment("2017-04-06"), Moment("2018-04-05")).should.equal("tax year");
    });

    it("should return 'other' if the period is not month/year/tax year", () => {
      getBudgetPeriodType(Moment("2018-01-01"), Moment("2018-01-02")).should.equal("other");
    });
  });

  describe("formatBudgetPeriod()", () => {
    it("should format month periods", () => {
      formatBudgetPeriod(Moment("2018-01-01"), Moment("2018-01-31")).should.equal("Jan, 2018");
      formatBudgetPeriod(Moment("2018-02-01"), Moment("2018-02-28")).should.equal("Feb, 2018");
    });

    it("should format calendar year periods", () => {
      formatBudgetPeriod(Moment("2018-01-01"), Moment("2018-12-31")).should.equal("2018");
    });

    it("should format tax year periods", () => {
      formatBudgetPeriod(Moment("2017-04-06"), Moment("2018-04-05")).should.equal("2017/2018 tax year");
    });

    it("should return simple format if the period is not month/year/tax year", () => {
      formatBudgetPeriod(Moment("2018-01-01"), Moment("2018-01-02")).should.equal(
        `${formatDate(Moment("2018-01-01"))} to ${formatDate(Moment("2018-01-02"))}`,
      );
    });
  });

  describe("generateCategoryTypeBadge()", () => {
    it("should apply the right class for each category type", () => {
      let category = { ...DEFAULT_CATEGORY, isIncomeCategory: true };
      let badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .find(`.${bs.badgeSuccess}`)
        .should.have.lengthOf(1);

      category = { ...DEFAULT_CATEGORY, isExpenseCategory: true };
      badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .find(`.${bs.badgeDanger}`)
        .should.have.lengthOf(1);

      category = { ...DEFAULT_CATEGORY, isAssetGrowthCategory: true };
      badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .find(`.${bs.badgeWarning}`)
        .should.have.lengthOf(1);

      category = { ...DEFAULT_CATEGORY, isMemoCategory: true };
      badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .find(`.${bs.badgeInfo}`)
        .should.have.lengthOf(1);
    });

    it("should insert the right text for each category type", () => {
      let category = { ...DEFAULT_CATEGORY, isIncomeCategory: true };
      let badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .text()
        .should.equal("Income");

      category = { ...DEFAULT_CATEGORY, isExpenseCategory: true };
      badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .text()
        .should.equal("Expense");

      category = { ...DEFAULT_CATEGORY, isAssetGrowthCategory: true };
      badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .text()
        .should.equal("Asset Growth");

      category = { ...DEFAULT_CATEGORY, isMemoCategory: true };
      badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .text()
        .should.equal("Memo");
    });

    it("should return one node when category has no types", () => {
      const category = DEFAULT_CATEGORY; // all types are false
      const badges = generateCategoryTypeBadge(category);
      badges.length.should.equal(1);
      shallow(badges[0])
        .filter("span")
        .should.have.lengthOf(1);
    });

    it("should return a styled 'none' message when category has no types", () => {
      const category = DEFAULT_CATEGORY; // all types are false
      const badge = generateCategoryTypeBadge(category)[0];
      shallow(badge)
        .find(`.${bs.textMuted}`)
        .should.have.lengthOf(1);
      shallow(badge)
        .text()
        .should.equal("None");
    });

    it("should return one node per category type", () => {
      let category = { ...DEFAULT_CATEGORY, isIncomeCategory: true };
      let badges = generateCategoryTypeBadge(category);
      badges.length.should.equal(1);

      category = { ...DEFAULT_CATEGORY, isIncomeCategory: true, isExpenseCategory: true };
      badges = generateCategoryTypeBadge(category);
      badges.length.should.equal(2);
    });
  });
});
