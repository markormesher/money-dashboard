import axios from "axios";
import { useState } from "react";
import { IEnvelope, mapEnvelopeFromApi } from "../../models/IEnvelope";
import { IEnvelopeAllocation } from "../../models/IEnvelopeAllocation";
import { IEnvelopeBalance, mapEnvelopeBalanceFromApi } from "../../models/IEnvelopeBalance";
import { globalErrorManager } from "../helpers/errors/error-manager";

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

async function saveEnvelopeAllocation(envelopeAllocation: IEnvelopeAllocation): Promise<void> {
  await axios.post(`/api/envelope-allocations/edit/${envelopeAllocation.id || ""}`, envelopeAllocation);
}

async function deleteEnvelopeAllocation(envelopeAllocation: IEnvelopeAllocation): Promise<void> {
  await axios.post(`/api/envelope-allocations/delete/${envelopeAllocation.id}`);
}

// hooks to access cached values

let cachedEnvelopeList: IEnvelope[] | undefined = undefined;

function useEnvelopeList(): [IEnvelope[] | undefined, () => void] {
  const [envelopeList, setEnvelopeList] = useState<IEnvelope[] | undefined>(cachedEnvelopeList);

  function refreshEnvelopeList(): void {
    getAllEnvelopes()
      .then((envelopes) => {
        setEnvelopeList(envelopes);
        cachedEnvelopeList = envelopes;
      })
      .catch((err) => {
        globalErrorManager.emitNonFatalError("Failed to reload envelope list", err);
      });
  }

  return [envelopeList, refreshEnvelopeList];
}

const EnvelopeApi = {
  saveEnvelope,
  deleteEnvelope,
  getAllEnvelopes,
  getEnvelopeBalancess,
  saveEnvelopeAllocation,
  deleteEnvelopeAllocation,
  useEnvelopeList,
};

export { EnvelopeApi };
