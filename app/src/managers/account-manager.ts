import Bluebird = require('bluebird');
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {Account} from '../models/Account';

export type AccountOrId = Account | string;

function convertAccountOrIdToId(accountOrId: AccountOrId): string {
	if (accountOrId instanceof Account) {
		return (accountOrId as Account).id;
	} else {
		return (accountOrId as string);
	}
}

function getAccount(user: User, accountOrId: AccountOrId): Bluebird<Account> {
	const accountId = convertAccountOrIdToId(accountOrId);
	return Account
			.findOne({
				where: {id: accountId},
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

function saveAccount(user: User, accountOrId: AccountOrId, properties: Partial<Account>): Bluebird<Account> {
	return getAccount(user, accountOrId)
			.then((account) => {
				account = account || new Account();
				return account.update(properties);
			})
			.then((account) => {
				return account.$set('profile', user.activeProfile);
			});
}

function deleteAccount(user: User, accountOrId: AccountOrId): Bluebird<void> {
	return getAccount(user, accountOrId)
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
	saveAccount,
	deleteAccount
}
