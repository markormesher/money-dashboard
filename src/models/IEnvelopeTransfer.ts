import { convertLocalDateToUtc, convertUtcDateToLocal } from "../utils/dates";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";
import { IEnvelope, mapEnvelopeFromApi, mapEnvelopeForApi } from "./IEnvelope";

interface IEnvelopeTransfer {
  readonly id: string;
  readonly date: number;
  readonly amount: number;
  readonly note: string;
  readonly deleted: boolean;

  readonly fromEnvelope: IEnvelope;
  readonly toEnvelope: IEnvelope;
  readonly profile: IProfile;
}

const DEFAULT_ENVELOPE_TRANSFER: IEnvelopeTransfer = {
  id: undefined,
  date: new Date().getTime(),
  amount: 0,
  note: null,
  deleted: false,

  fromEnvelope: undefined,
  toEnvelope: undefined,
  profile: undefined,
};

function mapEnvelopeTransferFromApi(allocation?: IEnvelopeTransfer): IEnvelopeTransfer {
  if (!allocation) {
    return undefined;
  }

  return {
    ...allocation,
    date: convertUtcDateToLocal(allocation.date),

    fromEnvelope: mapEnvelopeFromApi(allocation.fromEnvelope),
    toEnvelope: mapEnvelopeFromApi(allocation.toEnvelope),
    profile: mapProfileFromApi(allocation.profile),
  };
}

function mapEnvelopeTransferForApi(allocation?: IEnvelopeTransfer): IEnvelopeTransfer {
  if (!allocation) {
    return undefined;
  }

  return {
    ...allocation,
    date: convertLocalDateToUtc(allocation.date),

    fromEnvelope: mapEnvelopeForApi(allocation.fromEnvelope),
    toEnvelope: mapEnvelopeForApi(allocation.toEnvelope),
    profile: mapProfileForApi(allocation.profile), // TODO
  };
}

export { IEnvelopeTransfer, DEFAULT_ENVELOPE_TRANSFER, mapEnvelopeTransferFromApi, mapEnvelopeTransferForApi };
