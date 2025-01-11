import axios from "axios";
import { IDate } from "../../models/IDate";
import { IEnvelope, mapEnvelopeForApi, mapEnvelopeFromApi } from "../../models/IEnvelope";
import { IEnvelopeAllocation, mapEnvelopeAllocationForApi } from "../../models/IEnvelopeAllocation";
import { IEnvelopeBalance, mapEnvelopeBalanceFromApi } from "../../models/IEnvelopeBalance";
import { IEnvelopeTransfer, mapEnvelopeTransferForApi } from "../../models/IEnvelopeTransfer";
import { cacheWrap } from "./utils";

// envelopes

async function saveEnvelope(envelope: IEnvelope): Promise<void> {
  await axios.post(`/api/envelopes/edit/${envelope.id || ""}`, mapEnvelopeForApi(envelope));
}

async function deleteEnvelope(envelope: IEnvelope): Promise<void> {
  await axios.post(`/api/envelopes/delete/${envelope.id}`);
}

async function getAllEnvelopes(): Promise<IEnvelope[]> {
  const res = await axios.get<IEnvelope[]>("/api/envelopes/list");
  return res.data.map(mapEnvelopeFromApi);
}

async function getEnvelopeBalances(): Promise<IEnvelopeBalance[]> {
  const res = await axios.get<IEnvelopeBalance[]>("/api/envelopes/balances");
  return res.data.map(mapEnvelopeBalanceFromApi);
}

// envelope allocations

async function saveEnvelopeAllocation(envelopeAllocation: IEnvelopeAllocation): Promise<void> {
  await axios.post(
    `/api/envelope-allocations/edit/${envelopeAllocation.id || ""}`,
    mapEnvelopeAllocationForApi(envelopeAllocation),
  );
}

async function deleteEnvelopeAllocation(envelopeAllocation: IEnvelopeAllocation): Promise<void> {
  await axios.post(`/api/envelope-allocations/delete/${envelopeAllocation.id}`);
}

// envelope transfers

async function saveEnvelopeTransfer(envelopeTransfer: IEnvelopeTransfer): Promise<void> {
  await axios.post(
    `/api/envelope-transfers/edit/${envelopeTransfer.id || ""}`,
    mapEnvelopeTransferForApi(envelopeTransfer),
  );
}

async function deleteEnvelopeTransfer(envelopeTransfer: IEnvelopeTransfer): Promise<void> {
  await axios.post(`/api/envelope-transfers/delete/${envelopeTransfer.id}`);
}

async function cloneEnvelopeTransfers(transferIds: string[], date: IDate): Promise<void> {
  await axios.post("/api/envelope-transfers/clone", {
    envelopeTransferIds: transferIds,
    date: date.date,
  });
}

const EnvelopeApi = {
  saveEnvelope,
  deleteEnvelope,
  getAllEnvelopes,
  getEnvelopeBalances,
  saveEnvelopeAllocation,
  deleteEnvelopeAllocation,
  saveEnvelopeTransfer,
  deleteEnvelopeTransfer,
  cloneEnvelopeTransfers,

  // cached versisons
  useEnvelopeList: cacheWrap("envelope-list", getAllEnvelopes),
  useEnvelopeBalances: cacheWrap("envelope-balances", getEnvelopeBalances),
};

export { EnvelopeApi };
