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
			type: DataTypes.DATEONLY
		},
		end_date: {
			type: DataTypes.DATEONLY
		},
		slots_each_day: {
			type: DataTypes.INTEGER
		},
		slots: {
			type: DataTypes.ARRAY(DataTypes.TEXT),
			defaultValue: ['9-12, 3-5']
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
