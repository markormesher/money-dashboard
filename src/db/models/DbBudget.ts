import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { IBudget } from "../../models/IBudget";
import { BigIntTransformer } from "../BigIntTransformer";
import { BaseModel } from "./BaseModel";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";

@Entity("budget")
class DbBudget extends BaseModel implements IBudget {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    type: String,
    default: "budget",
  })
  public type: "budget" | "bill";

  @Column({
    type: "double precision",
  })
  public amount: number;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public startDate: number;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public endDate: number;

  @Column({ default: false })
  public deleted: boolean;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbCategory,
    /* istanbul ignore next */
    (c) => c.budgets,
  )
  public category: DbCategory;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.budgets,
  )
  public profile: DbProfile;

  public clone(): DbBudget {
    const output = new DbBudget();
    output.type = this.type;
    output.amount = this.amount;
    output.startDate = this.startDate;
    output.endDate = this.endDate;
    output.category = this.category;
    output.profile = this.profile;
    output.deleted = this.deleted;
    return output;
  }
}

export { DbBudget };
