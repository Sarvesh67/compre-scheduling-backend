const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'exams',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		date: {
			type: DataTypes.DATE
		},
		time: {
			type: DataTypes.ENUM('9-12', '2-5') // Add enumerations for compre times here
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
