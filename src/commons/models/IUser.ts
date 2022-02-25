import { mapEntities } from "../utils/entities";
import { IProfile, mapProfileFromApi, mapProfileForApi } from "./IProfile";

interface IUser {
  readonly id: string;
  readonly externalUsername: string;
  readonly displayName: string;
  readonly image: string;
  readonly profiles: IProfile[];
  readonly activeProfile: IProfile;
  readonly deleted: boolean;
}

const DEFAULT_USER: IUser = {
  id: null,
  externalUsername: "",
  displayName: "",
  image: "",
  deleted: false,

  profiles: undefined,
  activeProfile: undefined,
};

function mapUserFromApi(user?: IUser): IUser {
  if (!user) {
    return undefined;
  }

  return {
    ...user,

    profiles: mapEntities(mapProfileFromApi, user.profiles),
    activeProfile: mapProfileFromApi(user.activeProfile),
  };
}

function mapUserForApi(user?: IUser): IUser {
  if (!user) {
    return undefined;
  }

  return {
    ...user,

    profiles: mapEntities(mapProfileForApi, user.profiles),
    activeProfile: mapProfileForApi(user.activeProfile),
  };
}

export { IUser, DEFAULT_USER, mapUserFromApi, mapUserForApi };
