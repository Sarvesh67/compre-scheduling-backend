const { Sequelize, Op, DataTypes } = require('sequelize');
const config = require('../services/config.service');

const db = {};

db.sequelize = Sequelize;

// eslint-disable-next-line no-undef
db.conn = new Sequelize(config.db[process.env.NODE_ENV]);

db.connectDb = () => {
	return db.conn.authenticate().then(console.log('Postgres connection succesful on port: ' + config.db.port));
};

db.op = Op;
db.DataTypes = DataTypes;

// Define models here

// Define relationships here

module.exports = db;
