const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'courses_invigilators',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		status: {
			type: DataTypes.TEXT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
