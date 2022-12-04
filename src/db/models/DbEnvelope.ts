import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, OneToMany } from "typeorm";
import { IEnvelope } from "../../models/IEnvelope";
import { BaseModel } from "./BaseModel";
import { DbProfile } from "./DbProfile";
import { DbCategoryToEnvelopeAllocation } from "./DbCategoryToEnvelopeAllocation";

@Entity("envelope")
class DbEnvelope extends BaseModel implements IEnvelope {
  @PrimaryGeneratedColumn("uuid")
  public id: string;

  @Column()
  public name: string;

  @Column({ default: true })
  public active: boolean;

  @Column({ default: false })
  public deleted: boolean;

  @OneToMany(
    /* istanbul ignore next */
    () => DbCategoryToEnvelopeAllocation,
    /* istanbul ignore next */
    (a) => a.envelope,
  )
  public categoryAllocations: DbCategoryToEnvelopeAllocation[];

  @ManyToOne(
    /* istanbul ignore next */
    () => DbProfile,
    /* istanbul ignore next */
    (p) => p.envelopes,
  )
  public profile: DbProfile;
}

export { DbEnvelope };
