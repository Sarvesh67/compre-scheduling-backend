// const e = require('express');
const XLSX = require('xlsx');
const fs = require('fs');

const db = require('../database/db');
const { Op } = require('sequelize');
const path = require('path');

const sequelize = db.conn;

const sched = db.public.schedules;
const statics = db.public.statics;

const getOutput1 = async (req, res) => {
	try {
		var jsondata = [];
		const scheduleId = req.params.schedId;

		const exams = await sched.exam.findAll({
			where: {
				date: {
					[Op.not]: null
				},
				time: {
					[Op.not]: null
				},
				schedule_id: scheduleId
			},
			include: [
				{
					model: sched.examRoom,
					include: [
						sched.invigilatorsAlloted,
						{
							model: statics.rooms,
							attributes: ['name']
						}
					]
				}
			]
		});

		for (const exam of exams) {
			const course = await statics.courses.findOne({
				where: {
					id: exam.course_id
				},
				include: [statics.invigilators]
			});
			const invigilators = course.invigilators;
			var ic;
			await invigilators.forEach(async (invigilator) => {
				if (invigilator.courses_invigilators.status == 'ic') {
					ic = invigilator.name;
				}
			});
			var roomsString = '';
			var invigilatorsGiven = 0;
			for (const room of exam.exam_rooms) {
				roomsString += room.room.name + '(' + room.capacity + '), ';
				invigilatorsGiven += room.invigilatorsAlloteds.length;
			}

			const date = new Date(exam.date);
			const dateString = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
			var time;
			if (exam.time == '2-5') {
				time = '2:00pm-5:00pm';
			} else {
				time = '9:00am-12noon';
			}
			const newRow = {
				Course: course.bits_id,
				Title: course.title,
				IC: ic,
				Date: dateString,
				Time: time,
				Rooms: roomsString,
				'Invigilators Required': course.invigilators_required,
				'Invigilators Given': invigilatorsGiven
			};

			jsondata.push(newRow);
		}

		//console.log(jsondata)
		const ws = XLSX.utils.json_to_sheet(jsondata);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
		XLSX.writeFile(wb, 'output1.xlsx');
		var file = fs.readFileSync('output1.xlsx');
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output1.xlsx');
		res.end(file);
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const getOutput2 = async (req, res) => {
	try {
		var jsondata = [];
		//Fetching data
		const scheduleId = req.params.schedId;
		//Get All exams where date and time is defined
		const exams = await sched.exam.findAll({
			where: {
				date: {
					[Op.not]: null
				},
				time: {
					[Op.not]: null
				},
				schedule_id: scheduleId
			},
			include: [
				{
					model: sched.examRoom,
					attributes: {
						exclude: ['id', 'createdAt', 'updatedAt', 'room_id', 'exam_id', 'schedule_id']
					},
					include: [
						{
							model: sched.invigilatorsAlloted,
							attributes: {
								exclude: ['createdAt', 'updatedAt', 'exam_room_id', 'invigilators_id', 'schedule_id']
							},
							include: {
								model: statics.invigilators,
								attributes: {
									exclude: ['createdAt', 'updatedAt', 'id', 'duties_to_be_alloted', 'assignedDuties']
								}
							}
						},
						{
							model: statics.rooms,
							attributes: ['name', 'capacity']
						}
					]
				},
				{
					model: statics.courses,
					attributes: ['bits_id', 'discipline', 'title']
				}
			]
		});
		for (const exam of exams) {
			const date = new Date(exam.date);
			const dateString = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
			const time = exam.time;
			const course = await statics.courses.findAll({
				where: {
					bits_id: exam.course.bits_id
				},
				include: [
					{
						model: statics.invigilators,
						through: {
							where: {
								status: 'ic'
							}
						},
						attributes: ['name']
					}
				]
			});
			// console.log(course[0].invigilators[0].name)
			for (const room of exam.exam_rooms) {
				for (const invigilator of room.invigilatorsAlloteds) {
					const newRow = {
						Date: dateString,
						Time: time,
						Course: exam.course.bits_id,
						'Course Title': exam.course.title,
						Disc: exam.course.discipline,
						Name: invigilator.invigilator.name,
						'Email Address': invigilator.invigilator.email,
						'PSRN/System ID': invigilator.invigilator.psrn_no,
						Room: room.room.name,
						IC: course[0].invigilators[0].name
					};
					jsondata.push(newRow);
				}
			}
		}

		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.json_to_sheet(jsondata);

		XLSX.utils.book_append_sheet(wb, ws, 'Output6');

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output6.xlsx');

		const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		console.log('finished');
		// eslint-disable-next-line no-undef
		res.end(Buffer.from(s2ab(out)));
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const getOutput3 = async (req, res) => {
	try {
		const id = req.params.bitsId;
		const schedId = req.params.schedId;
		const courses = await statics.courses.findOne({
			where: { id: id },
			include: [
				{
					model: sched.exam,
					where: {
						schedule_id: schedId
					},
					attributes: {
						exclude: ['id', 'createdAt', 'updatedAt', 'course_id', 'schedule_id']
					},
					include: {
						model: sched.examRoom,
						attributes: {
							exclude: ['id', 'createdAt', 'updatedAt', 'room_id', 'exam_id', 'schedule_id']
						},
						include: [
							{
								model: sched.invigilatorsAlloted,
								attributes: {
									exclude: [
										'createdAt',
										'updatedAt',
										'exam_room_id',
										'invigilators_id',
										'schedule_id'
									]
								},
								include: {
									model: statics.invigilators,
									attributes: {
										exclude: [
											'createdAt',
											'updatedAt',
											'id',
											'duties_to_be_alloted',
											'assignedDuties'
										]
									}
								}
							},
							{
								model: statics.rooms,
								attributes: ['name', 'capacity']
							}
						]
					}
				}
			]
		});

		if (!courses) {
			return res.status(400).json({
				msg: 'Not found. Pls check your course id entered :('
			});
		}

		//Delete when working
		// return res.status(200).json({
		// 	courses
		// })
		//Delete when working

		var examDate = '';
		var examTime = '';
		const invigilators = [];
		//console.log(courses.exams.exam_rooms)

		for (const exams of courses.exams) {
			examDate = new Date(exams.date);
			examTime = exams.time;
			for (const room of exams.exam_rooms) {
				for (const invigilator of room.invigilatorsAlloteds) {
					const invigilator_data = {
						id: invigilator.id,
						room: room.room.name,
						name: invigilator.invigilator.name,
						psrn_no: invigilator.invigilator.psrn_no,
						dept: invigilator.invigilator.dept,
						stat1: invigilator.invigilator.stat1,
						stat2: invigilator.invigilator.stat2,
						email: invigilator.invigilator.email,
						mobile: invigilator.invigilator.mobile
					};
					invigilators.push(invigilator_data);
				}
			}
		}

		const course_data = [
			['bits_id', courses.bits_id],
			['title', courses.title],
			['capacity', courses.capacity],
			['invigilators_required', courses.invigilators_required],
			['discipline', courses.discipline],
			[
				'date',
				examDate.getDate().toString() +
					'/' +
					examDate.getMonth().toString() +
					'/' +
					examDate.getFullYear().toString()
			],
			['Time', examTime],
			['', '']
		];

		// courses.exams.exam_rooms.forEach((room) => {
		// 		room.invigilatorsAlloteds.forEach((invigilator) => {
		// 		const invigilator_data = {
		// 			id: invigilator.id,
		// 			room: room.room.name,
		// 			name: invigilator.invigilator.name,
		// 			psrn_no: invigilator.invigilator.psrn_no,
		// 			dept: invigilator.invigilator.dept,
		// 			stat1: invigilator.invigilator.stat1,
		// 			stat2: invigilator.invigilator.stat2,
		// 			email: invigilator.invigilator.email,
		// 		};
		// 		invigilators.push(invigilator_data);
		// 	})
		// });

		// return res.status(200).json({
		// 	output: course_data,
		// 	list: invigilators
		// })

		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.aoa_to_sheet(course_data);

		XLSX.utils.sheet_add_json(ws, invigilators, { origin: -1 });
		XLSX.utils.book_append_sheet(wb, ws, 'Output3');

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output3.xlsx');

		const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });

		// eslint-disable-next-line no-undef
		res.end(Buffer.from(s2ab(out)));
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error',
			stack: e
		});
	}
};

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const getOutput4 = async (req, res) => {
	try {
		const invigilatorId = req.params.invigilatorId;
		const schedId = req.params.schedId;
		const duty_details = await statics.invigilators.findOne({
			where: { psrn_no: invigilatorId },
			include: [
				{
					model: sched.invigilatorsAlloted,
					where: {
						schedule_id: schedId
					},
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'exam_room_id', 'invigilators_id']
					},
					include: [
						{
							model: sched.examRoom,
							attributes: {
								exclude: ['createdAt', 'updatedAt', 'room_id', 'exam_id']
							},
							include: [
								{
									model: sched.exam,
									attributes: {
										exclude: ['createdAt', 'updatedAt', 'course_id']
									},
									include: [
										{
											model: statics.courses,
											attributes: {
												exclude: ['createdAt', 'updatedAt', 'block_id']
											},
											include: [
												{
													model: statics.invigilators,
													attributes: ['mobile', 'email'],
													through: {
														where: { status: 'ic' }
													}
												}
											]
										},
										{
											model: sched.schedules,
											attributes: {
												exclude: ['createdAt', 'updatedAt']
											},
											include: [
												{
													model: sched.user,
													attributes: {
														exclude: ['createdAt']
													}
												}
											]
										}
									]
								},
								{
									model: statics.rooms,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								}
							]
						}
					]
				},
				{
					model: statics.courses,
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'block_id']
					},
					through: {
						attributes: ['status']
					}
				}
			]
		});

		const invigilator_data = [
			['id', duty_details.id],
			['name', duty_details.name],
			['psrn_no', duty_details.psrn_no],
			['dept', duty_details.dept],
			['stat1', duty_details.stat1],
			['stat2', duty_details.stat2],
			['email', duty_details.email],
			['duties_to_be_alloted', duty_details.duties_to_be_alloted],
			['mobile', duty_details.mobile],
			['assignedDuties', duty_details.assignedDuties],
			['', '']
			// status: duty_details.courses.courses_invigilators.status
		];

		const duties = [];
		duty_details.invigilatorsAlloteds.forEach((allotment) => {
			const duty = {
				Date: allotment.exam_room.exam.date,
				Time: allotment.exam_room.exam.time,
				'Course No': allotment.exam_room.exam.course.bits_id,
				'Course Title': allotment.exam_room.exam.course.title,
				'IC Mobile': allotment.exam_room.exam.course.invigilators[0].mobile,
				'IC Email': allotment.exam_room.exam.course.invigilators[0].email,
				'Room No': allotment.exam_room.room.name,
				'Capacity of course in the room': allotment.exam_room.capacity,
				'Schedule Name': allotment.exam_room.exam.schedule.name,
				'Name of scheduler': allotment.exam_room.exam.schedule.user.name,
				'Email of scheduler': allotment.exam_room.exam.schedule.user.email,
				'Total Room Capacity': allotment.exam_room.room.capacity
			};
			duties.push(duty);
		});

		console.log(duties);

		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.aoa_to_sheet(invigilator_data);

		XLSX.utils.sheet_add_json(ws, duties, { origin: -1 });
		XLSX.utils.book_append_sheet(wb, ws, 'Output4');

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output4.xlsx');

		const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		console.log('finished');
		// eslint-disable-next-line no-undef
		res.end(Buffer.from(s2ab(out)));
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error :(',
			stack: e
		});
	}
};

const getOutput5 = async (req, res) => {
	try {
		var jsondata = [];
		const scheduleId = req.params.schedId;
		const schedule = await sched.exam.findAll({
			where: {
				date: {
					[Op.not]: null
				},
				time: {
					[Op.not]: null
				},
				schedule_id: scheduleId
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'course_id']
			},
			include: [
				{
					model: sched.examRoom,
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'room_id', 'exam_id']
					},
					include: [
						{
							model: sched.invigilatorsAlloted,
							attributes: {
								exclude: ['createdAt', 'updatedAt']
							}
						}
					]
				}
			]
		});

		const dateDict = {};

		schedule.forEach((exam) => {
			const date = new Date(exam.date);
			const dateString = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();

			for (const room of exam.exam_rooms) {
				for (const invi of room.invigilatorsAlloteds) {
					const id = invi.invigilators_id;
					if (id in dateDict) {
						if (dateString in dateDict[id]) {
							dateDict[id][dateString]++;
						} else {
							dateDict[id][dateString] = 1;
						}
					} else {
						dateDict[id] = {};
						dateDict[id][dateString] = 1;
					}
				}
			}
		});

		for (const key in dateDict) {
			var value = '';
			for (const date in dateDict[key]) {
				if (dateDict[key][date] > 1) {
					value += date + ', ';
				}
			}

			const invigilatorData = await statics.invigilators.findByPk(key);

			console.log(invigilatorData);

			const newRow = {
				name: invigilatorData.name,
				'PSRN/System ID': invigilatorData.psrn_no,
				'Dates Alloted': value
			};
			jsondata.push(newRow);
		}

		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.json_to_sheet(jsondata);

		//XLSX.utils.sheet_add_json(ws, duties, { origin: -1 });
		XLSX.utils.book_append_sheet(wb, ws, 'Output5');

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output5.xlsx');

		const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		console.log('finished');
		// eslint-disable-next-line no-undef
		res.end(Buffer.from(s2ab(out)));
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const getOutput6 = async (req, res) => {
	try {
		var jsondata = [];
		const scheduleId = req.params.schedId;
		const invigilatorsList = await sched.invigilatorsAlloted.findAll({
			where: {
				schedule_id: scheduleId
			},
			attributes: ['invigilators_id', [sequelize.fn('count', sequelize.col('invigilators_id')), 'count']],
			group: ['invigilators_id']
		});

		for (const invigilator of invigilatorsList) {
			const data = await statics.invigilators.findByPk(invigilator.invigilators_id);
			console.log(invigilator.dataValues.count);
			const newRow = {
				name: data.name,
				'PSRN/SYSTEM ID': data.psrn_no,
				'No. Of Duties In Total': invigilator.dataValues.count,
				STAT: data.stat1
			};
			jsondata.push(newRow);
		}

		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.json_to_sheet(jsondata);

		//XLSX.utils.sheet_add_json(ws, duties, { origin: -1 });
		XLSX.utils.book_append_sheet(wb, ws, 'Output6');

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output6.xlsx');

		const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		console.log('finished');
		// eslint-disable-next-line no-undef
		res.end(Buffer.from(s2ab(out)));
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const getOutput7 = async (req, res) => {
	try {
		const schedule_id = req.params.schedId;
		const schedule = await sched.schedules.findAll({
			where: {
				id: schedule_id
			},
			attributes: {
				exclude: ['createdAt', 'updatedAt', 'course_id']
			},
			include: [
				{
					model: sched.examRoom,
					attributes: {
						exclude: ['createdAt', 'updatedAt', 'room_id', 'exam_id']
					},
					include: [
						{
							model: statics.rooms,
							attributes: {
								exclude: ['createdAt', 'updatedAt']
							}
						},
						{
							model: sched.exam,
							attributes: {
								exclude: ['createdAt', 'updatedAt']
							},
							include: [
								{
									model: statics.courses,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								}
							]
						},
						{
							model: sched.invigilatorsAlloted,
							attributes: {
								exclude: ['createdAt', 'updatedAt']
							},
							include: [
								{
									model: statics.invigilators,
									attributes: {
										exclude: ['createdAt', 'updatedAt']
									}
								}
							]
						}
					]
				}
			]
		});
		// eslint-disable-next-line no-undef
		let regData = JSON.parse(fs.readFileSync(path.resolve(__dirname, '../../compre-data/regdata.json'), 'utf-8'));
		const exam_rooms = schedule[0].exam_rooms;

		for (let i = 0; i < exam_rooms.length; i++) {
			const room_id = exam_rooms[i].room.id;
			const room_name = exam_rooms[i].room.name;
			console.log(room_name);
			if (room_id === 1) {
				continue;
			}
			const courseIds = exam_rooms[i].exam.course.code;
			const capacity = exam_rooms[i].room.capacity;
			let c = 0;

			exit_loop: for (let k = 0; k < courseIds.length; k++) {
				console.log(courseIds[k]);
				// Find CourseID in reg data.
				for (let j = 0; j < regData.length; j++) {
					if (courseIds[k] == regData[j].CourseID) {
						console.log('loop3-if');
						regData[j]['room'] = room_name;
						c = c + 1;
					}
					if (c >= capacity) {
						console.log(c + '  ' + capacity);
						console.log('break loop');
						break exit_loop;
					}
				}
			}
		}
		// fs.writeFileSync('regdata2.json', JSON.stringify(regData, null, 2));
		/* return res.status(200).json({
			schedule: schedule
		}); */
		const wb = XLSX.utils.book_new();

		const ws = XLSX.utils.json_to_sheet(regData);

		//XLSX.utils.sheet_add_json(ws, duties, { origin: -1 });
		XLSX.utils.book_append_sheet(wb, ws, 'Output7');

		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output7.xlsx');

		const out = XLSX.write(wb, { bookType: 'xlsx', type: 'binary' });
		console.log('finished');
		// eslint-disable-next-line no-undef
		res.end(Buffer.from(s2ab(out)));
		return;
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

module.exports = {
	getOutput1: getOutput1,
	getOutput2: getOutput2,
	getOutput3: getOutput3,
	getOutput4: getOutput4,
	getOutput5: getOutput5,
	getOutput6: getOutput6,
	getOutput7: getOutput7
};

//s2ab method
function s2ab(s) {
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf); //create uint8array as viewer
	for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
	return buf;
}
