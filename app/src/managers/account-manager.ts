import { Op } from "sequelize";
import { Account } from '../models/Account';
import { Profile } from '../models/Profile';
import { User } from '../models/User';
import Bluebird = require('bluebird');

function getAccount(user: User, accountId: string): Bluebird<Account> {
	return Account
			.findOne({
				where: { id: accountId },
				include: [Profile]
			})
			.then((account) => {
				if (account && user && account.profile.id !== user.activeProfile.id) {
					throw new Error('User does not own this account');
				} else {
					return account;
				}
			});
}

function getAllAccounts(user: User, activeOnly: boolean = true): Bluebird<Account[]> {
	const activeOnlyQueryFragment = activeOnly ? { active: true } : {};

	return Account.findAll({
		where: {
			profileId: user.activeProfile.id,
			[Op.and]: activeOnlyQueryFragment
		},
		include: [Profile]
	});
}

function saveAccount(user: User, accountId: string, properties: Partial<Account>): Bluebird<Account> {
	return getAccount(user, accountId)
			.then((account) => {
				account = account || new Account();
				return account.update(properties);
			})
			.then((account) => {
				return account.$set('profile', user.activeProfile);
			});
}

function toggleAccountActive(user: User, accountId: string): Bluebird<Account> {
	return getAccount(user, accountId)
			.then((account) => {
				account.active = !account.active;
				return account.save();
			});
}

function deleteAccount(user: User, accountId: string): Bluebird<void> {
	return getAccount(user, accountId)
			.then((account) => {
				if (!account) {
					throw new Error('That account does not exist');
				} else {
					return account;
				}
			})
			.then((account) => account.destroy());
}

export {
	getAccount,
	getAllAccounts,
	saveAccount,
	toggleAccountActive,
	deleteAccount
}
