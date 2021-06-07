// Static models
const courses = require('./static/courses');
const block = require('./static/block');
const invigilators = require('./static/invigilators');
const unavailableDates = require('./static/unavailableDates');
const teamMembers = require('./static/teamMembers');

// Schedule models
const exam = require('./schedule/exam');
const examRoom = require('./schedule/examRoom');
const invigilatorsAlloted = require('./schedule/invigilatorsAlloted');
const rooms = require('./static/room');
const schedules = require('./schedule/schedules');
const user = require('./schedule/user');

const db = {
	statics: {
		courses: courses,
		block: block,
		invigilators: invigilators,
		unavailableDates: unavailableDates,
		rooms: rooms,
		teamMembers: teamMembers
	},
	schedules: {
		exam: exam,
		examRoom: examRoom,
		invigilatorsAlloted: invigilatorsAlloted,
		schedules: schedules,
		user: user
	}
};

Object.freeze(db);

module.exports = db;
