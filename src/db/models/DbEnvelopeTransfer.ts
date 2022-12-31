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
    { nullable: true },
  )
  public fromEnvelope: DbEnvelope;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbEnvelope,
    /* istanbul ignore next */
    (e) => e.envelopeTransfersIn,
    { nullable: true },
  )
  public toEnvelope: DbEnvelope;

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.envelopeTransfers,
  )
  public profile: DbProfile;

  public clone(): DbEnvelopeTransfer {
    const output = new DbEnvelopeTransfer();
    output.date = this.date;
    output.amount = this.amount;
    output.note = this.note;
    output.fromEnvelope = this.fromEnvelope;
    output.toEnvelope = this.toEnvelope;
    output.profile = this.profile;
    output.deleted = this.deleted;
    return output;
  }
}

export { DbEnvelopeTransfer };
