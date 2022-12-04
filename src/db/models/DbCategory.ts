import { BaseEntity, Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ICategory } from "../../models/ICategory";
import { DbBudget } from "./DbBudget";
import { DbCategoryToEnvelopeAllocation } from "./DbCategoryToEnvelopeAllocation";
import { DbProfile } from "./DbProfile";
import { DbTransaction } from "./DbTransaction";

@Entity("category")
class DbCategory extends BaseEntity implements ICategory {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({ default: false })
  public isMemoCategory: boolean;

  @Column({ default: false })
  public isIncomeCategory: boolean;

  @Column({ default: false })
  public isExpenseCategory: boolean;

  @Column({ default: false })
  public isAssetGrowthCategory: boolean;

  @Column({ default: false })
  public deleted: boolean;

  @OneToMany(
    /* istanbul ignore next */
    () => DbBudget,
    /* istanbul ignore next */
    (b) => b.category,
  )
  public budgets: DbBudget[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbTransaction,
    /* istanbul ignore next */
    (t) => t.category,
  )
  public transactions: DbTransaction[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbCategoryToEnvelopeAllocation,
    /* istanbul ignore next */
    (a) => a.category,
  )
  public envelopeAllocations: DbCategoryToEnvelopeAllocation[];

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.categories,
  )
  public profile: DbProfile;
}

export { DbCategory };
