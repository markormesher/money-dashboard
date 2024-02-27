import axios from "axios";
import { IDate } from "../../models/IDate";
import { IEnvelope, mapEnvelopeFromApi } from "../../models/IEnvelope";
import { IEnvelopeAllocation } from "../../models/IEnvelopeAllocation";
import { IEnvelopeBalance, mapEnvelopeBalanceFromApi } from "../../models/IEnvelopeBalance";
import { IEnvelopeTransfer } from "../../models/IEnvelopeTransfer";
import { cacheWrap } from "./utils";

// envelopes

async function saveEnvelope(envelope: IEnvelope): Promise<void> {
  await axios.post(`/api/envelopes/edit/${envelope.id || ""}`, envelope);
}

async function deleteEnvelope(envelope: IEnvelope): Promise<void> {
  await axios.post(`/api/envelopes/delete/${envelope.id}`);
}

async function getAllEnvelopes(): Promise<IEnvelope[]> {
  const res = await axios.get<IEnvelope[]>("/api/envelopes/list");
  return res.data.map(mapEnvelopeFromApi);
}

async function getEnvelopeBalancess(): Promise<IEnvelopeBalance[]> {
  const res = await axios.get<IEnvelopeBalance[]>("/api/envelopes/balances");
  return res.data.map(mapEnvelopeBalanceFromApi);
}

// envelope allocations

async function saveEnvelopeAllocation(envelopeAllocation: IEnvelopeAllocation): Promise<void> {
  await axios.post(`/api/envelope-allocations/edit/${envelopeAllocation.id || ""}`, envelopeAllocation);
}

async function deleteEnvelopeAllocation(envelopeAllocation: IEnvelopeAllocation): Promise<void> {
  await axios.post(`/api/envelope-allocations/delete/${envelopeAllocation.id}`);
}

// envelope transfers

async function saveEnvelopeTransfer(envelopeTransfer: IEnvelopeTransfer): Promise<void> {
  await axios.post(`/api/envelope-transfers/edit/${envelopeTransfer.id || ""}`, envelopeTransfer);
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
  getEnvelopeBalancess,
  saveEnvelopeAllocation,
  deleteEnvelopeAllocation,
  saveEnvelopeTransfer,
  deleteEnvelopeTransfer,
  cloneEnvelopeTransfers,
  useEnvelopeList: cacheWrap("envelope-list", getAllEnvelopes),
};

export { EnvelopeApi };
