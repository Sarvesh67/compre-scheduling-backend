	const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'exam_rooms',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		capacity: {
			type: DataTypes.INTEGER
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
