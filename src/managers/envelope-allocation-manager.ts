import { SelectQueryBuilder } from "typeorm";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbEnvelopeAllocation } from "../db/models/DbEnvelopeAllocation";
import { DbUser } from "../db/models/DbUser";

interface IEnvelopeAllocationQueryBuilderOptions {
  readonly withProfile?: boolean;
}

function getEnvelopeAllocationQueryBuilder(
  options: IEnvelopeAllocationQueryBuilderOptions = {},
): SelectQueryBuilder<DbEnvelopeAllocation> {
  let builder = DbEnvelopeAllocation.createQueryBuilder("allocation")
    .leftJoinAndSelect("allocation.envelope", "envelope")
    .leftJoinAndSelect("allocation.category", "category");

  if (options.withProfile) {
    builder = builder.leftJoinAndSelect("allocation.profile", "profile");
  }

  return builder;
}

function getEnvelopeAllocation(user: DbUser, allocationId?: string): Promise<DbEnvelopeAllocation> {
  return getEnvelopeAllocationQueryBuilder()
    .where("allocation.id = :allocationId")
    .andWhere("allocation.profile_id = :profileId")
    .andWhere("allocation.deleted = FALSE")
    .setParameters({
      allocationId: cleanUuid(allocationId),
      profileId: user.activeProfile.id,
    })
    .getOne();
}

function getAllEnvelopeAllocations(user: DbUser, activeOnly = true): Promise<DbEnvelopeAllocation[]> {
  const query = getEnvelopeAllocationQueryBuilder()
    .where("allocation.profile_id = :profileId")
    .andWhere("allocation.deleted = FALSE")
    .setParameters({
      profileId: user.activeProfile.id,
    });

  if (activeOnly) {
    // TODO: active = newest for that category
  }

  return query.getMany();
}

function saveEnvelopeAllocation(
  user: DbUser,
  allocationId: string,
  properties: Partial<DbEnvelopeAllocation>,
): Promise<DbEnvelopeAllocation> {
  return getEnvelopeAllocation(user, allocationId).then((allocation) => {
    allocation = DbEnvelopeAllocation.getRepository().merge(allocation || new DbEnvelopeAllocation(), properties);
    allocation.profile = user.activeProfile;
    return allocation.save();
  });
}

function deleteEnvelopeAllocation(user: DbUser, allocationId: string): Promise<DbEnvelopeAllocation> {
  return getEnvelopeAllocation(user, allocationId).then((allocation) => {
    if (!allocation) {
      throw new StatusError(404, "That envelope allocation does not exist");
    } else {
      allocation.deleted = true;
      return allocation.save();
    }
  });
}

export {
  getEnvelopeAllocationQueryBuilder,
  getEnvelopeAllocation,
  getAllEnvelopeAllocations,
  saveEnvelopeAllocation,
  deleteEnvelopeAllocation,
};
