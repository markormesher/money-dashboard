import Bluebird = require('bluebird');
import {User} from '../models/User';
import {Profile} from '../models/Profile';
import {Category} from '../models/Category';

export type CategoryOrId = Category | string;

function convertCategoryOrIdToId(categoryOrId: CategoryOrId): string {
	if (categoryOrId instanceof Category) {
		return (categoryOrId as Category).id;
	} else {
		return (categoryOrId as string);
	}
}

function getCategory(user: User, categoryOrId: CategoryOrId): Bluebird<Category> {
	const categoryId = convertCategoryOrIdToId(categoryOrId);
	return Category
			.findOne({
				where: {id: categoryId},
				include: [Profile]
			})
			.then((category) => {
				if (category && user && category.profile.id !== user.activeProfile.id) {
					throw new Error('User does not own this category');
				} else {
					return category;
				}
			});
}

function getAllCategories(user: User): Bluebird<Category[]> {
	return Category.findAll({
		where: {
			profileId: user.activeProfile.id
		},
		include: [Profile]
	});
}

function saveCategory(user: User, categoryOrId: CategoryOrId, properties: Partial<Category>): Bluebird<Category> {
	return getCategory(user, categoryOrId)
			.then((category) => {
				category = category || new Category();
				return category.update(properties);
			})
			.then((category) => {
				return category.$set('profile', user.activeProfile);
			});
}

function deleteCategory(user: User, categoryOrId: CategoryOrId): Bluebird<void> {
	return getCategory(user, categoryOrId)
			.then((category) => {
				if (!category) {
					throw new Error('That category does not exist');
				} else {
					return category;
				}
			})
			.then((category) => category.destroy());
}

export {
	getCategory,
	getAllCategories,
	saveCategory,
	deleteCategory
}
