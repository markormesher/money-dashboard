import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { ICategoryToEnvelopeAllocation } from "../../models/ICategoryToEnvelopeAllocation";
import { DbCategory } from "./DbCategory";
import { DbProfile } from "./DbProfile";
import { DbEnvelope } from "./DbEnvelope";

@Entity("category_to_envelope_allocation")
class DbCategoryToEnvelopeAllocation extends BaseEntity implements ICategoryToEnvelopeAllocation {
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
    (p) => p.transactions,
  )
  public profile: DbProfile;
}

export { DbCategoryToEnvelopeAllocation };
