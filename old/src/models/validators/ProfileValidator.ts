import { IProfile } from "../IProfile";
import { IValidationResult } from "./IValidationResult";

function validateProfile(profile: IProfile): IValidationResult<IProfile> {
  if (!profile) {
    return {
      isValid: false,
      errors: {},
    };
  }

  let result: IValidationResult<IProfile> = {
    isValid: true,
    errors: {},
  };

  if (!profile.name || profile.name.trim() === "") {
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

export { validateProfile };
