import { SelectQueryBuilder } from "typeorm";
import { ICategoryBalance } from "../models/ICategoryBalance";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbCategory } from "../db/models/DbCategory";
import { DbUser } from "../db/models/DbUser";
import { CurrencyCode } from "../models/ICurrency";
import { getTransactionQueryBuilder } from "./transaction-manager";
import { getLatestExchangeRates } from "./exchange-rate-manager";

interface ICategoryQueryBuilderOptions {
  readonly withProfile?: boolean;
}

function getCategoryQueryBuilder(options: ICategoryQueryBuilderOptions = {}): SelectQueryBuilder<DbCategory> {
  let builder = DbCategory.createQueryBuilder("category");

  if (options.withProfile) {
    builder = builder.leftJoinAndSelect("category.profile", "profile");
  }

  return builder;
}

function getCategory(user: DbUser, categoryId?: string): Promise<DbCategory> {
  return getCategoryQueryBuilder()
    .where("category.id = :categoryId")
    .andWhere("category.profile_id = :profileId")
    .andWhere("category.deleted = FALSE")
    .setParameters({
      categoryId: cleanUuid(categoryId),
      profileId: user.activeProfile.id,
    })
    .getOne();
}

function getAllCategories(user: DbUser): Promise<DbCategory[]> {
  return getCategoryQueryBuilder()
    .where("category.profile_id = :profileId")
    .andWhere("category.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    })
    .getMany();
}

async function getMemoCategoryBalances(user: DbUser): Promise<ICategoryBalance[]> {
  const balances: Array<{
    amount: string;
    category_id: string;
    currency_code: CurrencyCode;
  }> = await getTransactionQueryBuilder({ withCategory: true, withAccount: true })
    .select("transaction.category_id")
    .addSelect("account.currency_code")
    .addSelect("ROUND(SUM(amount)::numeric, 2)", "amount")
    .where("category.is_memo_category = TRUE")
    .andWhere("transaction.deleted = FALSE")
    .andWhere("category.deleted = FALSE")
    .groupBy("transaction.category_id")
    .addGroupBy("account.currency_code")
    .getRawMany();

  const categories = await getAllCategories(user);
  const exchangeRates = await getLatestExchangeRates();

  const balanceMap: { [key: string]: number } = {};

  balances.forEach((balance) => {
    const gbpBalance = parseFloat(balance.amount) / exchangeRates[balance.currency_code].ratePerGbp;
    balanceMap[balance.category_id] = (balanceMap[balance.category_id] || 0) + gbpBalance;
  });

  return categories
    .filter((category) => category.isMemoCategory)
    .map((category) => {
      return {
        category,
        balance: balanceMap[category.id] || 0,
      };
    })
    .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance));
}

function saveCategory(user: DbUser, categoryId: string, properties: Partial<DbCategory>): Promise<DbCategory> {
  return getCategory(user, categoryId).then((category) => {
    category = DbCategory.getRepository().merge(category || new DbCategory(), properties);
    category.profile = user.activeProfile;
    return category.save();
  });
}

function deleteCategory(user: DbUser, categoryId: string): Promise<DbCategory> {
  return getCategory(user, categoryId).then((category) => {
    if (!category) {
      throw new StatusError(404, "That category does not exist");
    } else {
      category.deleted = true;
      return category.save();
    }
  });
}

export {
  getCategoryQueryBuilder,
  getCategory,
  getAllCategories,
  getMemoCategoryBalances,
  saveCategory,
  deleteCategory,
};
