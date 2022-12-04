import { convertLocalDateToUtc, convertUtcDateToLocal } from "../utils/dates";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";
import { ICategory, mapCategoryFromApi, mapCategoryForApi } from "./ICategory";
import { IEnvelope, mapEnvelopeFromApi, mapEnvelopeForApi } from "./IEnvelope";

interface ICategoryToEnvelopeAllocation {
  readonly id: string;
  readonly startDate: number;
  readonly deleted: boolean;

  readonly category: ICategory;
  readonly envelope: IEnvelope;
  readonly profile: IProfile;
}

const DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION: ICategoryToEnvelopeAllocation = {
  id: undefined,
  startDate: new Date().getTime(),
  deleted: false,

  category: undefined,
  envelope: undefined,
  profile: undefined,
};

function mapCategoryToEnvelopeAllocationFromApi(
  allocation?: ICategoryToEnvelopeAllocation,
): ICategoryToEnvelopeAllocation {
  if (!allocation) {
    return undefined;
  }

  return {
    ...allocation,
    startDate: convertUtcDateToLocal(allocation.startDate),

    category: mapCategoryFromApi(allocation.category),
    envelope: mapEnvelopeFromApi(allocation.envelope),
    profile: mapProfileFromApi(allocation.profile),
  };
}

function mapCategoryToEnvelopeAllocationForApi(
  allocation?: ICategoryToEnvelopeAllocation,
): ICategoryToEnvelopeAllocation {
  if (!allocation) {
    return undefined;
  }

  return {
    ...allocation,
    startDate: convertLocalDateToUtc(allocation.startDate),

    category: mapCategoryForApi(allocation.category),
    envelope: mapEnvelopeForApi(allocation.envelope),
    profile: mapProfileForApi(allocation.profile), // TODO
  };
}

export {
  ICategoryToEnvelopeAllocation,
  DEFAULT_CATEGORY_TO_ENVELOPE_ALLOCATION,
  mapCategoryToEnvelopeAllocationFromApi,
  mapCategoryToEnvelopeAllocationForApi,
};
