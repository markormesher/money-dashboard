import { SelectQueryBuilder } from "typeorm";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbEnvelope } from "../db/models/DbEnvelope";
import { DbUser } from "../db/models/DbUser";

interface IEnvelopeQueryBuilderOptions {
  readonly withProfile?: boolean;
}

function getEnvelopeQueryBuilder(options: IEnvelopeQueryBuilderOptions = {}): SelectQueryBuilder<DbEnvelope> {
  let builder = DbEnvelope.createQueryBuilder("envelope");

  if (options.withProfile) {
    builder = builder.leftJoinAndSelect("envelope.profile", "profile");
  }

  return builder;
}

function getEnvelope(user: DbUser, envelopeId?: string): Promise<DbEnvelope> {
  return getEnvelopeQueryBuilder()
    .where("envelope.id = :envelopeId")
    .andWhere("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .setParameters({
      envelopeId: cleanUuid(envelopeId),
      profileId: user.activeProfile.id,
    })
    .getOne();
}

function getAllEnvelopes(user: DbUser, activeOnly = true): Promise<DbEnvelope[]> {
  let query = getEnvelopeQueryBuilder()
    .where("envelope.profile_id = :profileId")
    .andWhere("envelope.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  if (activeOnly) {
    query = query.andWhere("envelope.active = TRUE");
  }

  return query.getMany();
}

function saveEnvelope(user: DbUser, envelopeId: string, properties: Partial<DbEnvelope>): Promise<DbEnvelope> {
  return getEnvelope(user, envelopeId).then((envelope) => {
    envelope = DbEnvelope.getRepository().merge(envelope || new DbEnvelope(), properties);
    envelope.profile = user.activeProfile;
    return envelope.save();
  });
}

function setEnvelopeActive(user: DbUser, envelopeId: string, active: boolean): Promise<DbEnvelope> {
  return getEnvelope(user, envelopeId).then((envelope) => {
    envelope.active = active;
    return envelope.save();
  });
}

function deleteEnvelope(user: DbUser, envelopeId: string): Promise<DbEnvelope> {
  return getEnvelope(user, envelopeId).then((envelope) => {
    if (!envelope) {
      throw new StatusError(404, "That envelope does not exist");
    } else {
      envelope.deleted = true;
      return envelope.save();
    }
  });
}

export { getEnvelopeQueryBuilder, getEnvelope, getAllEnvelopes, saveEnvelope, setEnvelopeActive, deleteEnvelope };
