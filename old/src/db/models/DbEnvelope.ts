import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IEnvelope } from "../../models/IEnvelope";
import { BaseModel } from "./BaseModel";
import { DbProfile } from "./DbProfile";
import { DbEnvelopeAllocation } from "./DbEnvelopeAllocation";
import { DbEnvelopeTransfer } from "./DbEnvelopeTransfer";

@Entity("envelope")
class DbEnvelope extends BaseModel implements IEnvelope {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({ default: false })
  public deleted: boolean;

  @OneToMany(
    /* istanbul ignore next */
    () => DbEnvelopeAllocation,
    /* istanbul ignore next */
    (a) => a.envelope,
  )
  public categoryAllocations: DbEnvelopeAllocation[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbEnvelopeTransfer,
    /* istanbul ignore next */
    (t) => t.fromEnvelope,
  )
  public envelopeTransfersOut: DbEnvelopeTransfer[];

  @OneToMany(
    /* istanbul ignore next */
    () => DbEnvelopeTransfer,
    /* istanbul ignore next */
    (t) => t.toEnvelope,
  )
  public envelopeTransfersIn: DbEnvelopeTransfer[];

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.envelopes,
  )
  public profile: DbProfile;
}

export { DbEnvelope };
