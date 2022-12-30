import { SelectQueryBuilder } from "typeorm";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbEnvelopeTransfer } from "../db/models/DbEnvelopeTransfer";
import { DbUser } from "../db/models/DbUser";

interface IEnvelopeTransferQueryBuilderOptions {
  readonly withProfile?: boolean;
}

function getEnvelopeTransferQueryBuilder(
  options: IEnvelopeTransferQueryBuilderOptions = {},
): SelectQueryBuilder<DbEnvelopeTransfer> {
  let builder = DbEnvelopeTransfer.createQueryBuilder("transfer")
    .leftJoinAndSelect("transfer.fromEnvelope", "from_envelope")
    .leftJoinAndSelect("transfer.toEnvelope", "to_envelope");

  if (options.withProfile) {
    builder = builder.leftJoinAndSelect("transfer.profile", "profile");
  }

  return builder;
}

function getEnvelopeTransfer(user: DbUser, transferId?: string): Promise<DbEnvelopeTransfer> {
  return getEnvelopeTransferQueryBuilder()
    .where("transfer.id = :transferId")
    .andWhere("transfer.profile_id = :profileId")
    .andWhere("transfer.deleted = FALSE")
    .setParameters({
      transferId: cleanUuid(transferId),
      profileId: user.activeProfile.id,
    })
    .getOne();
}

function getAllEnvelopeTransfers(user: DbUser): Promise<DbEnvelopeTransfer[]> {
  const query = getEnvelopeTransferQueryBuilder()
    .where("transfer.profile_id = :profileId")
    .andWhere("transfer.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  return query.getMany();
}

function saveEnvelopeTransfer(
  user: DbUser,
  transferId: string,
  properties: Partial<DbEnvelopeTransfer>,
): Promise<DbEnvelopeTransfer> {
  // TODO: updating an envelope to null after previously being set does not work
  return getEnvelopeTransfer(user, transferId).then((transfer) => {
    transfer = DbEnvelopeTransfer.getRepository().merge(transfer || new DbEnvelopeTransfer(), properties);
    transfer.profile = user.activeProfile;
    return transfer.save();
  });
}

function deleteEnvelopeTransfer(user: DbUser, transferId: string): Promise<DbEnvelopeTransfer> {
  return getEnvelopeTransfer(user, transferId).then((transfer) => {
    if (!transfer) {
      throw new StatusError(404, "That envelope transfer does not exist");
    } else {
      transfer.deleted = true;
      return transfer.save();
    }
  });
}

export {
  getEnvelopeTransferQueryBuilder,
  getEnvelopeTransfer,
  getAllEnvelopeTransfers,
  saveEnvelopeTransfer,
  deleteEnvelopeTransfer,
};
