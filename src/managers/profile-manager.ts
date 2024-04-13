import { SelectQueryBuilder } from "typeorm";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbProfile } from "../db/models/DbProfile";
import { DbUser } from "../db/models/DbUser";
import { getUser } from "./user-manager";

type IProfileQueryBuilderOptions = {
  readonly withUsers?: boolean;
};

function getProfileQueryBuilder(options: IProfileQueryBuilderOptions = {}): SelectQueryBuilder<DbProfile> {
  let builder = DbProfile.createQueryBuilder("profile");

  if (options.withUsers) {
    builder = builder.leftJoinAndSelect("profile.users", "user");
  }

  return builder;
}

function getProfile(user: DbUser, profileId: string): Promise<DbProfile> {
  return getProfileQueryBuilder({ withUsers: true })
    .where("profile.id = :profileId")
    .andWhere("profile.deleted = FALSE")
    .andWhere("user.id = :userId")
    .setParameters({
      profileId: cleanUuid(profileId),
      userId: cleanUuid(user.id),
    })
    .getOne();
}

function getAllProfiles(user: DbUser): Promise<DbProfile[]> {
  return getProfileQueryBuilder({ withUsers: true })
    .where("profile.deleted = FALSE")
    .andWhere("user.id = :userId")
    .setParameters({
      userId: cleanUuid(user.id),
    })
    .getMany();
}

function createProfileAndAddToUser(user: DbUser, profileName: string): Promise<DbUser> {
  // re-select the user from the DB to make sure we have their existing profiles
  return DbProfile.create({ name: profileName })
    .save()
    .then((profile) => {
      return Promise.all([profile, getUser(user.id)]);
    })
    .then(([profile, userFromDb]) => {
      userFromDb.profiles = user.profiles || [];
      userFromDb.profiles.push(profile);
      return user.save();
    });
}

function saveProfile(user: DbUser, profileId: string, properties: Partial<DbProfile>): Promise<DbProfile> {
  return getProfile(user, profileId).then((profile) => {
    profile = DbProfile.getRepository().merge(profile || new DbProfile(), properties);
    profile.users = profile.users || [];
    if (profile.users.findIndex((u) => u.id === user.id) < 0) {
      profile.users.push(user);
    }
    return profile.save();
  });
}

function deleteProfile(user: DbUser, profileId: string): Promise<DbProfile> {
  return getProfile(user, profileId).then((profile) => {
    if (!profile) {
      throw new StatusError(404, "That profile does not exist");
    } else if (user.profiles.length <= 1) {
      throw new StatusError(400, "Cannot delete a user's last profile");
    } else {
      profile.deleted = true;
      return profile.save();
    }
  });
}

function setActiveProfileForUser(user: DbUser, profileId: string): Promise<DbUser> {
  return getUser(user.id).then((u) => {
    u.activeProfile = user.profiles.find((p) => p.id === profileId) || user.profiles[0];
    return u.save();
  });
}

export {
  getProfileQueryBuilder,
  getProfile,
  getAllProfiles,
  createProfileAndAddToUser,
  saveProfile,
  deleteProfile,
  setActiveProfileForUser,
};
