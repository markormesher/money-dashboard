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

async function saveProfile(profile: IProfile): Promise<void> {
  await axios.post(`/api/profiles/edit/${profile.id || ""}`, profile);
}

async function deleteProfile(profile: IProfile): Promise<void> {
  await axios.post(`/api/profiles/delete/${profile.id}`);
}

async function setActiveProfile(profileId: string): Promise<void> {
  await axios.post(`/api/profiles/select/${profileId}`);
}

const UserApi = {
  getCurrentUser,
};

const ProfileApi = {
  getAllProfiles,
  saveProfile,
  deleteProfile,
  setActiveProfile,
};

export { UserApi, ProfileApi };
