import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";
import { ICategoryToEnvelopeAllocation } from "./ICategoryToEnvelopeAllocation";

interface IEnvelope {
  readonly id: string;
  readonly name: string;
  readonly active: boolean;
  readonly deleted: boolean;

  readonly categoryAllocations: ICategoryToEnvelopeAllocation[];
  readonly profile: IProfile;
}

const DEFAULT_ENVELOPE: IEnvelope = {
  id: undefined,
  name: undefined,
  active: true,
  deleted: false,

  categoryAllocations: undefined,
  profile: undefined,
};

function mapEnvelopeFromApi(envelope?: IEnvelope): IEnvelope {
  if (!envelope) {
    return undefined;
  }

  return {
    ...envelope,

    profile: mapProfileFromApi(envelope.profile),
  };
}

function mapEnvelopeForApi(envelope?: IEnvelope): IEnvelope {
  if (!envelope) {
    return undefined;
  }

  return {
    ...envelope,

    profile: mapProfileForApi(envelope.profile), // TODO
  };
}

export { IEnvelope, DEFAULT_ENVELOPE, mapEnvelopeFromApi, mapEnvelopeForApi };
