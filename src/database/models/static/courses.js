const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'courses',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		bits_id: {
			type: DataTypes.TEXT
		},
		title: {
			type: DataTypes.TEXT
		},
		capacity: {
			type: DataTypes.INTEGER
		},
		invigilators_required: {
			type: DataTypes.INTEGER
		},
		discipline: {
			type: DataTypes.TEXT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
