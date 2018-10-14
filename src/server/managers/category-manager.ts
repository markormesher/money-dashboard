import * as Bluebird from "bluebird";
import { Category } from "../models/Category";
import { Profile } from "../models/Profile";
import { User } from "../models/User";

function getCategory(user: User, categoryId: string): Bluebird<Category> {
	return Category
			.findOne({
				where: { id: categoryId },
				include: [Profile],
			})
			.then((category) => {
				if (category && user && category.profile.id !== user.activeProfile.id) {
					throw new Error("User does not own this category");
				} else {
					return category;
				}
			});
}

function getAllCategories(user: User): Bluebird<Category[]> {
	return Category.findAll({
		where: {
			profileId: user.activeProfile.id,
		},
		include: [Profile],
	});
}

function saveCategory(user: User, categoryId: string, properties: Partial<Category>): Bluebird<Category> {
	return getCategory(user, categoryId)
			.then((category) => {
				category = category || new Category();
				return category.update(properties);
			})
			.then((category) => {
				return category.$set("profile", user.activeProfile);
			});
}

function deleteCategory(user: User, categoryId: string): Bluebird<void> {
	return getCategory(user, categoryId)
			.then((category) => {
				if (!category) {
					throw new Error("That category does not exist");
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
	deleteCategory,
};
