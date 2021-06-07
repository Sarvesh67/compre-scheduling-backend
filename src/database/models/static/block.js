const db = require('../../conn');
const DataTypes = db.DataTypes;
const sequelize = db.conn;

module.exports = sequelize.define(
	'blocks',
	{
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		/* time: {
			type: DataTypes.ENUM('MWF:9-10', 'TThF:11-12') // Add enumerations for block here
		} */
		time: {
			type: DataTypes.TEXT
		}
	},
	{
		underscored: true,
		timestamps: true
	}
);
