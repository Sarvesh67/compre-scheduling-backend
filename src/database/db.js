const conn = require('./conn');
const models = require('./models/model');

var db = Object.assign({ public: models }, conn);

// Define relations here
const statics = db.public.statics;
const schedules = db.public.schedules;

// Statics relations
statics.block.hasMany(statics.courses, { foreignKey: 'block_id', onDelete: 'CASCADE' });
statics.invigilators.hasMany(statics.unavailableDates, {
	foreignKey: 'invigilator_id',
	onDelete: 'CASCADE',
	sourceKey: 'psrn_no'
});
statics.invigilators.belongsToMany(statics.courses, {
	through: statics.teamMembers,
	foreignKey: 'invigilator_id',
	onDelete: 'CASCADE',
	sourceKey: 'psrn_no',
	constraints: false
});
statics.courses.belongsToMany(statics.invigilators, {
	through: statics.teamMembers,
	foreignKey: 'courses_id',
	onDelete: 'CASCADE',
	sourceKey: 'bits_id',
	constraints: false
});

// Schedules relations
schedules.user.hasMany(schedules.schedules, { foreignKey: 'user_id', onDelete: 'CASCADE' });
schedules.schedules.belongsTo(schedules.user, { foreignKey: 'user_id', onDelete: 'CASCADE' });
schedules.schedules.hasMany(schedules.exam, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });
schedules.schedules.hasMany(schedules.examRoom, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });
schedules.schedules.hasMany(schedules.invigilatorsAlloted, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });

schedules.exam.belongsTo(schedules.schedules, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });
schedules.examRoom.belongsTo(schedules.schedules, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });
schedules.invigilatorsAlloted.belongsTo(schedules.schedules, { foreignKey: 'schedule_id', onDelete: 'CASCADE' });

statics.courses.hasMany(schedules.exam, {
	foreignKey: 'course_id',
	onDelete: 'CASCADE'
});
/* schedules.exam.belongsTo(statics.courses, {
	foreignKey: 'exam_id',
	onDelete: 'CASCADE'
}); */
/* schedules.exam.belongsTo(schedules.schedules, {
	foreignKey: 'exam_id',
	onDelete: 'CASCADE'
}); */

schedules.exam.hasMany(schedules.examRoom, {
	foreignKey: 'exam_id',
	sourceKey: 'id',
	onDelete: 'CASCADE'
});

schedules.exam.belongsTo(statics.courses, {
	foreignKey: 'course_id',
	onDelete: 'CASCADE'
});
/* schedules.examRoom.belongsTo(schedules.exam, {
	foreignKey: 'exam_room_id',
	onDelete: 'CASCADE'
}); */

statics.rooms.hasMany(schedules.examRoom, {
	foreignKey: 'room_id',
	onDelete: 'CASCADE'
});
schedules.examRoom.belongsTo(schedules.exam, {
	foreignKey: 'exam_id',
	targetKey: 'id',
	onDelete: 'CASCADE'
});
schedules.examRoom.belongsTo(statics.rooms, {
	foreignKey: 'room_id',
	onDelete: 'CASCADE'
});

schedules.examRoom.hasMany(schedules.invigilatorsAlloted, {
	foreignKey: 'exam_room_id',
	sourceKey: 'id',
	onDelete: 'CASCADE'
});
statics.invigilators.hasMany(schedules.invigilatorsAlloted, {
	foreignKey: 'invigilators_id',
	sourceKey: 'id',
	onDelete: 'CASCADE'
});
schedules.invigilatorsAlloted.belongsTo(statics.invigilators, {
	foreignKey: 'invigilators_id',
	targetKey: 'id',
	onDelete: 'CASCADE'
});

schedules.invigilatorsAlloted.belongsTo(schedules.examRoom, {
	foreignKey: 'exam_room_id',
	targetKey: 'id',
	onDelete: 'CASCADE'
});

module.exports = db;
