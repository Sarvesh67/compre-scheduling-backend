const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'unavailable_dates',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		unavailable_date: {
			type: DataTypes.BIGINT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
