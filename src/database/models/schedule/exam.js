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
			// slot
			type: DataTypes.TEXT // Add enumerations for compre times here
		},
		schedule_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: 'UniqueExams'
		},
		course_id: {
			type: DataTypes.BIGINT,
			allowNull: false,
			unique: 'UniqueExams'
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
