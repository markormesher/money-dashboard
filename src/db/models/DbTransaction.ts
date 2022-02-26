import { BaseEntity, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { ITransaction } from "../../../commons/models/ITransaction";
import { BigIntTransformer } from "../BigIntTransformer";
import { DbAccount } from "./DbAccount";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";

@Entity("transaction")
class DbTransaction extends BaseEntity implements ITransaction {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public transactionDate: number;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public effectiveDate: number;

  @CreateDateColumn({
    type: "timestamp",
  })
  public creationDate: number;

  @Column({ type: "double precision" })
  public amount: number;

  @Column()
  public payee: string;

  @Column({ nullable: true })
  public note: string;

  @Column({ default: false })
  public deleted: boolean;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbAccount,
    /* istanbul ignore next */
    (a) => a.transactions,
  )
  public account: DbAccount;

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
    (p) => p.transactions,
  )
  public profile: DbProfile;
}

export { DbTransaction };
