import { BaseEntity, Column, Entity, ManyToMany, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { IProfile } from "../../models/IProfile";
import { DbAccount } from "./DbAccount";
import { DbBudget } from "./DbBudget";
import { DbCategory } from "./DbCategory";
import { DbEnvelope } from "./DbEnvelope";
import { DbTransaction } from "./DbTransaction";
import { DbUser } from "./DbUser";
import { DbEnvelopeAllocation } from "./DbEnvelopeAllocation";
import { DbEnvelopeTransfer } from "./DbEnvelopeTransfer";

@Entity("profile")
class DbProfile extends BaseEntity implements IProfile {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({ default: false })
  public deleted: boolean;

  @OneToMany(
    /* istanbul ignore next */
    () => DbAccount,
    /* istanbul ignore next */
    (a) => a.profile,
  )
  public accounts: DbAccount[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbBudget,
    /* istanbul ignore next */
    (b) => b.profile,
  )
  public budgets: DbBudget[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbCategory,
    /* istanbul ignore next */
    (c) => c.profile,
  )
  public categories: DbCategory[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbEnvelope,
    /* istanbul ignore next */
    (e) => e.profile,
  )
  public envelopes: DbEnvelope[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbEnvelopeAllocation,
    /* istanbul ignore next */
    (a) => a.profile,
  )
  public envelopeAllocations: DbEnvelopeAllocation[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbEnvelopeTransfer,
    /* istanbul ignore next */
    (t) => t.profile,
  )
  public envelopeTransfers: DbEnvelopeTransfer[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbTransaction,
    /* istanbul ignore next */
    (t) => t.profile,
  )
  public transactions: DbTransaction[];

  @ManyToMany(
    /* istanbul ignore next */
    () => DbUser,
    /* istanbul ignore next */
    (u) => u.profiles,
  )
  public users: DbUser[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbUser,
    /* istanbul ignore next */
    (b) => b.activeProfile,
  )
  public usersWithProfileActivated: DbUser[];
}

export { DbProfile };
