// const express = require('express');
const db = require('../database/db');

const sched = db.public.schedules;
const statics = db.public.statics;

const deleteUnwantedExamRooms = async (wantedRooms, examId) => {
	const wantedRoomIds = wantedRooms.map((x) => x.id);

	// fetch images
	const rooms = await sched.examRoom.findAll({
		where: {
			id: examId
		}
	});

	const roomsToDelete = rooms.filter((x) => !wantedRoomIds.includes(x.id));
	for (const room of roomsToDelete) {
		await sched.examRoom.destroy({
			where: {
				id: room.id
			}
		});
	}
};

const deleteUnwantedInvigilators = async (wantedInvigilators, examRoomId) => {
	const wantedInvigilatorIds = wantedInvigilators.map((x) => x.id);

	// fetch images
	const invigils = await sched.invigilatorsAlloted.findAll({
		where: {
			id: examRoomId
		}
	});

	const invigilatorsToDelete = invigils.filter((x) => !wantedInvigilatorIds.includes(x.id));
	for (const invig of invigilatorsToDelete) {
		await sched.invigilatorsAlloted.destroy({
			where: {
				id: invig.id
			}
		});
	}
};

function upsertExamRoom(values, room_id) {
	if (room_id) {
		return sched.examRoom
			.findOne({
				where: {
					id: room_id
				}
			})
			.then(function (obj) {
				// update
				if (obj)
					return obj.update(values, {
						where: {
							id: room_id
						},
						returning: true
					});
				// insert
				return sched.examRoom.create(values);
			});
	} else {
		return sched.examRoom.create(values);
	}
}

function upsertInvigilator(values, invig_id) {
	if (invig_id) {
		return sched.invigilatorsAlloted
			.findOne({
				where: {
					id: invig_id
				}
			})
			.then(function (obj) {
				// update
				if (obj)
					return obj.update(values, {
						where: {
							id: invig_id
						},
						returning: true
					});
				// insert
				return sched.invigilatorsAlloted.create(values);
			});
	} else {
		return sched.invigilatorsAlloted.create(values);
	}
}

const create = async (req, res) => {
	try {
		const newSched = req.body;
		const user_id = req.params.userId;
		newSched.user_id = user_id;
		// newSched.start_date = new Date(newSched.start_date);
		// newSched.end_date = new Date(newSched.end_date);
		console.log(newSched);
		const user_count = await sched.user.findAll({
			where: {
				id: user_id
			}
		});
		if (user_count.length < 1) {
			return res.status(200).json({
				msg: 'User DNE'
			});
		} else {
			const schedSaved = await sched.schedules.create(newSched);
			const courses = await statics.courses.findAll({});
			const exams = [];
			courses.forEach(async (course) => {
				const exam = {
					schedule_id: schedSaved.id,
					course_id: course.id
				};
				exams.push(exam);
			});
			const examsaved = await sched.exam.bulkCreate(exams);
			return res.status(200).json({
				msg: 'Schedule successfully created!',
				user: schedSaved,
				exam: examsaved
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal Server Error :('
		});
	}
};

const getAll = async (req, res) => {
	try {
		const scheduleList = await sched.schedules.findAll({});
		return res.status(200).json({
			msg: 'Users successfully retireved',
			schedules: scheduleList
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const get = async (req, res) => {
	try {
		const id = req.params.id;
		const schedule = await sched.schedules.findByPk(id);
		const exams = await sched.exam.findAll({
			where: {
				schedule_id: schedule.id
			},
			include: [
				{
					model: sched.examRoom,
					include: [
						statics.rooms,
						{
							model: sched.invigilatorsAlloted,
							include: [statics.invigilators]
						}
					]
				},
				{
					model: statics.courses,
					include: [statics.invigilators]
				}
			]
		});
		return res.status(200).json({
			msg: 'Schedule Retrieved Successfully',
			schedule: schedule,
			exams: exams
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const update = async (req, res) => {
	try {
		const updateSched = req.body.schedule;
		const id = req.params.id;
		const exams = req.body.exams;
		var updatedSchedule;
		if (updateSched != null) {
			updatedSchedule = await sched.schedules.update(updateSched, { where: { id: id }, returning: true });
		} else {
			updatedSchedule = await sched.schedules.findByPk(id);
		}
		//console.log(exams);
		if (exams == null) {
			return res.status(200).json({
				msg: 'Schedule Details Successfully updated!',
				schedule: updatedSchedule
			});
		}
		exams.forEach(async (exam) => {
			//update the exam block
			const exam_id = exam.id;
			await sched.exam.update(exam, {
				where: {
					id: exam_id
				},
				returning: true
			});
			//reading the exam rooms
			const examRooms = exam.exam_rooms;

			if (examRooms == null) {
				return;
			}

			deleteUnwantedExamRooms(examRooms, id);

			examRooms.forEach(async (room) => {
				//update exam room
				let room_id = room.id;
				const newRoom = await upsertExamRoom(room, room_id);
				//reading the invigilators Alloted

				if (room_id == null) {
					room_id = newRoom.id;
				}

				const invigilatorsAlloted = room.invigilatorsAlloteds;

				if (invigilatorsAlloted == null) {
					return;
				}

				deleteUnwantedInvigilators(invigilatorsAlloted, room_id);

				invigilatorsAlloted.forEach(async (invig) => {
					//update invigilator Alloted
					const invig_id = invig.id;
					await upsertInvigilator(invig, {
						id: invig_id
					});
				});
			});
		});

		return res.status(200).json({
			msg: 'Schedule Details Successfully updated!',
			schedule: updatedSchedule
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const deleteSched = async (req, res) => {
	try {
		await sched.schedules.destroy({
			where: {
				id: req.params.id
			}
		});
		return res.status(200).json({
			msg: 'Schedule Successfully Deleted'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

module.exports = {
	create: create,
	getAll: getAll,
	delete: deleteSched,
	update: update,
	get: get
};
