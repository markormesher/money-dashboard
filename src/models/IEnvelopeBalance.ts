import { IEnvelope, mapEnvelopeFromApi } from "./IEnvelope";

type IEnvelopeBalance = {
  readonly envelope: IEnvelope;
  readonly balance: number;
};

function mapEnvelopeBalanceFromApi(balance?: IEnvelopeBalance): IEnvelopeBalance {
  if (!balance) {
    return undefined;
  }

  return {
    ...balance,
    envelope: mapEnvelopeFromApi(balance.envelope),
  };
}

export { IEnvelopeBalance, mapEnvelopeBalanceFromApi };
