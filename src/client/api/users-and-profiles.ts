import axios from "axios";
import { IProfile, mapProfileFromApi } from "../../models/IProfile";
import { IUser, mapUserFromApi } from "../../models/IUser";
import { mapEntities } from "../../utils/entities";

async function getCurrentUser(): Promise<IUser> {
  const res = await axios.get("/api/auth/current-user");
  return mapUserFromApi(res.data as IUser);
}

async function getAllProfiles(): Promise<IProfile[]> {
  const res = await axios.get("/api/profiles/list");
  return mapEntities(mapProfileFromApi, res.data as IProfile[]);
}

async function setActiveProfile(profileId: string): Promise<void> {
  return axios.post(`/api/profiles/select/${profileId}`);
}

export { getCurrentUser, getAllProfiles, setActiveProfile };
