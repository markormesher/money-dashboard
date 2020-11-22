import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IAccount, AccountTag, AccountType } from "../../../commons/models/IAccount";
import { CurrencyCode } from "../../../commons/models/ICurrency";
import { BaseModel } from "./BaseModel";
import { DbProfile } from "./DbProfile";
import { DbTransaction } from "./DbTransaction";

@Entity("account")
class DbAccount extends BaseModel implements IAccount {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({ type: "character varying", default: "current" })
  public type: AccountType;

  @Column({ type: "character varying", array: true, default: "{}" })
  public tags: AccountTag[];

  @Column({ nullable: true })
  public note: string;

  @Column({ type: "character varying" })
  public currencyCode: CurrencyCode;

  @Column({ default: true })
  public active: boolean;

  @Column({ default: false })
  public deleted: boolean;

  @OneToMany(
    /* istanbul ignore next */
    () => DbTransaction,
    /* istanbul ignore next */
    (t) => t.account,
  )
  public transactions: DbTransaction[];

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.accounts,
  )
  public profile: DbProfile;
}

export { DbAccount };
