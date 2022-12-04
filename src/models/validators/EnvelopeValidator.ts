import { IEnvelope } from "../IEnvelope";

interface IEnvelopeValidationResult {
  readonly isValid: boolean;
  readonly errors: {
    readonly name?: string;
  };
}

function validateEnvelope(envelope: IEnvelope): IEnvelopeValidationResult {
  if (!envelope) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IEnvelopeValidationResult = {
    isValid: true,
    errors: {},
  };

  if (!envelope.name || envelope.name.trim() === "") {
    result = {
      isValid: false,
      errors: {
        ...result.errors,
        name: "The name must not be blank",
      },
    };
  }

  return result;
}

export { IEnvelopeValidationResult, validateEnvelope };
