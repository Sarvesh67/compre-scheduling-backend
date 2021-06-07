const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'users',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		name: {
			type: DataTypes.TEXT
		},
		email: {
			type: DataTypes.TEXT
		},
		password: {
			type: DataTypes.TEXT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
