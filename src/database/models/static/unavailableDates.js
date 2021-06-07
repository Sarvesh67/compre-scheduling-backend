const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'unavailableDates',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		unavailable_date: {
			type: DataTypes.TIME
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
