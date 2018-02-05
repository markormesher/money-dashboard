import {Sequelize} from 'sequelize-typescript';
import Path = require('path');
import ConfigLoader = require('./config-loader');

const sequelize = new Sequelize({
	host: 'postgres',
	username: 'money_dashboard',
	password: ConfigLoader.getSecret('postgres.password'),
	database: 'money_dashboard',
	dialect: 'postgres',
	pool: {
		max: 5,
		min: 0,
		acquire: 30000,
		idle: 10000
	},
	operatorsAliases: false,
	modelPaths: [Path.join(__dirname, '../models')],
	define: {
		freezeTableName: true,
		timestamps: true,
		paranoid: true,
		version: true
	},
	logging: () => {}
});

export = sequelize
