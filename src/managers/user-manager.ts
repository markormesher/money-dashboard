import { SelectQueryBuilder } from "typeorm";
import { StatusError } from "../utils/StatusError";
import { cleanUuid } from "../utils/entities";
import { DbUser } from "../db/models/DbUser";
import { createProfileAndAddToUser } from "./profile-manager";

interface IUserQueryBuilderOptions {
  readonly withProfiles?: boolean;
  readonly withActiveProfile?: boolean;
}

function getUserQueryBuilder(options: IUserQueryBuilderOptions = {}): SelectQueryBuilder<DbUser> {
  let builder = DbUser.createQueryBuilder("user");

  if (options.withProfiles) {
    builder = builder.leftJoinAndSelect("user.profiles", "profile");
  }

  if (options.withActiveProfile) {
    builder = builder.leftJoinAndSelect("user.activeProfile", "active_profile");
  }

  return builder;
}

async function getUser(userId: string): Promise<DbUser> {
  return getUserQueryBuilder({ withProfiles: true, withActiveProfile: true })
    .where("user.id = :userId")
    .andWhere("user.deleted = FALSE")
    .setParameters({
      userId: cleanUuid(userId),
    })
    .getOne()
    .then((user) => {
      if (user) {
        user.profiles.sort((a, b) => a.name.localeCompare(b.name));
      }
      return user;
    });
}

async function getOrCreateUserWithExternalUsername(externalUsername: string, displayName?: string): Promise<DbUser> {
  return getUserQueryBuilder({ withProfiles: true, withActiveProfile: true })
    .where("user.externalUsername = :externalUsername")
    .andWhere("user.deleted = FALSE")
    .setParameters({
      externalUsername,
    })
    .getOne()
    .then((user: DbUser) => {
      // make a user if we didn't find one
      if (!user) {
        return DbUser.create<DbUser>({ externalUsername, displayName }).save();
      } else {
        return user;
      }
    })
    .then((user: DbUser) => {
      // make sure the user has a profile
      if (!user.profiles || user.profiles.length === 0) {
        return createProfileAndAddToUser(user, "Default Profile");
      } else {
        return user;
      }
    })
    .then((user: DbUser) => {
      // make sure a profile is active
      if (!user.activeProfile) {
        if (!user.profiles || user.profiles.length === 0) {
          throw new StatusError(500, "User has no profiles after profile creation stage");
        }

        user.activeProfile = user.profiles[0];
        return user.save();
      } else {
        return user;
      }
    })
    .then((user: DbUser) => {
      // update details
      user.displayName = displayName;
      return user.save();
    });
}

export { getUserQueryBuilder, getUser, getOrCreateUserWithExternalUsername };
