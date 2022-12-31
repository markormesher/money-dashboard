import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { IEnvelopeAllocation } from "../../models/IEnvelopeAllocation";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";
import { DbEnvelope } from "./DbEnvelope";

@Entity("envelope_allocation")
class DbEnvelopeAllocation extends BaseEntity implements IEnvelopeAllocation {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public startDate: number;

  @Column({ default: false })
  public deleted: boolean;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbCategory,
    /* istanbul ignore next */
    (c) => c.envelopeAllocations,
  )
  public category: DbCategory;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbEnvelope,
    /* istanbul ignore next */
    (a) => a.categoryAllocations,
  )
  public envelope: DbEnvelope;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.envelopeTransfers,
  )
  public profile: DbProfile;
}

export { DbEnvelopeAllocation };
