const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'invigilatorsAlloted',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		exam_room_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: 'UniqueInvigilatorsAlloted'
		},
		invigilators_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: 'UniqueInvigilatorsAlloted'
		},
		schedule_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: 'UniqueInvigilatorsAlloted'
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
