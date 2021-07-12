const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'schedules',
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
		start_date: {
			type: DataTypes.DATE
		},
		end_date: {
			type: DataTypes.DATE
		},
		slots_each_day: {
			type: DataTypes.INTEGER
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
