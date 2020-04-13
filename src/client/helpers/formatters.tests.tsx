import { expect } from "chai";
import { shallow } from "enzyme";
import { describe, it } from "mocha";
import { parseISO } from "date-fns";
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

    it("should format dates for the system", () => {
      formatDate(parseISO("2015-04-01").getTime(), "system").should.equal("2015-04-01");
    });

    it("should format dates for users", () => {
      formatDate(parseISO("2015-04-01").getTime(), "user").should.equal("01 Apr 2015");
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
    it("should detect normal month periods", () => {
      getBudgetPeriodType(parseISO("2018-01-01").getTime(), parseISO("2018-01-31").getTime()).should.equal("month");
    });

    it("should detect leap year month periods", () => {
      // non-leap
      getBudgetPeriodType(parseISO("2019-02-01").getTime(), parseISO("2019-02-28").getTime()).should.equal("month");

      // leap
      getBudgetPeriodType(parseISO("2020-02-01").getTime(), parseISO("2020-02-29").getTime()).should.equal("month");
      getBudgetPeriodType(parseISO("2020-02-01").getTime(), parseISO("2020-02-28").getTime()).should.not.equal("month");
    });

    it("should not detect month periods when the year does not match", () => {
      getBudgetPeriodType(parseISO("2018-01-01").getTime(), parseISO("2019-01-31").getTime()).should.not.equal("month");
    });

    it("should detect calendar year periods", () => {
      getBudgetPeriodType(parseISO("2018-01-01").getTime(), parseISO("2018-12-31").getTime()).should.equal(
        "calendar year",
      );
    });

    it("should not detect calendar year periods when the year does not match", () => {
      getBudgetPeriodType(parseISO("2018-01-01").getTime(), parseISO("2019-12-31").getTime()).should.not.equal(
        "calendar year",
      );
    });

    it("should detect tax year periods", () => {
      getBudgetPeriodType(parseISO("2017-04-06").getTime(), parseISO("2018-04-05").getTime()).should.equal("tax year");
    });

    it("should not detect tax year periods when the year does not match", () => {
      getBudgetPeriodType(parseISO("2017-04-06").getTime(), parseISO("2019-04-05").getTime()).should.not.equal(
        "tax year",
      );
    });

    it("should return 'other' if the period is not month/year/tax year", () => {
      getBudgetPeriodType(parseISO("2018-01-01").getTime(), parseISO("2018-01-02").getTime()).should.equal("other");
    });
  });

  describe("formatBudgetPeriod()", () => {
    it("should format month periods", () => {
      formatBudgetPeriod(parseISO("2018-01-01").getTime(), parseISO("2018-01-31").getTime()).should.equal("Jan, 2018");
      formatBudgetPeriod(parseISO("2018-02-01").getTime(), parseISO("2018-02-28").getTime()).should.equal("Feb, 2018");
    });

    it("should format calendar year periods", () => {
      formatBudgetPeriod(parseISO("2018-01-01").getTime(), parseISO("2018-12-31").getTime()).should.equal("2018");
    });

    it("should format tax year periods", () => {
      formatBudgetPeriod(parseISO("2017-04-06").getTime(), parseISO("2018-04-05").getTime()).should.equal(
        "2017/2018 tax year",
      );
    });

    it("should return simple format if the period is not month/year/tax year", () => {
      formatBudgetPeriod(parseISO("2018-01-01").getTime(), parseISO("2018-01-02").getTime()).should.equal(
        `${formatDate(parseISO("2018-01-01").getTime())} to ${formatDate(parseISO("2018-01-02").getTime())}`,
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
