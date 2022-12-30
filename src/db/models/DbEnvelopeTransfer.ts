import { BaseEntity, Column, Entity, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { BigIntTransformer } from "../BigIntTransformer";
import { IEnvelopeTransfer } from "../../models/IEnvelopeTransfer";
import { DbProfile } from "./DbProfile";
import { DbEnvelope } from "./DbEnvelope";

@Entity("envelope_transfer")
class DbEnvelopeTransfer extends BaseEntity implements IEnvelopeTransfer {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column({
    type: "bigint",
    transformer: new BigIntTransformer(),
  })
  public date: number;

  @Column({ type: "double precision" })
  public amount: number;

  @Column({ nullable: true })
  public note: string;

  @Column({ default: false })
  public deleted: boolean;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbEnvelope,
    /* istanbul ignore next */
    (e) => e.envelopeTransfersOut,
  )
  public fromEnvelope: DbEnvelope;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbEnvelope,
    /* istanbul ignore next */
    (e) => e.envelopeTransfersIn,
  )
  public toEnvelope: DbEnvelope;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.envelopeTransfers,
  )
  public profile: DbProfile;
}

export { DbEnvelopeTransfer };
