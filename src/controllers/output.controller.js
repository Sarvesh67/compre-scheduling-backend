// eslint-disable-next-line no-unused-vars
const e = require('express');
const XLSX = require('xlsx');
const fs = require('fs');

const db = require('../database/db');
const { Op } = require('sequelize');

const sched = db.public.schedules;
const statics = db.public.statics;

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const getOutput1 = async (req, res) => {
	try {
		var jsondata = [];
		const scheduleId = req.params.schedId;
		/**'
		 * course -
		 * title -
		 * ic -
		 * date -
		 * time -
		 * Rooms -
		 * invigilators Required -
		 * invgilators Given -
		 */

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
			//console.log(exam)
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
			//console.log(roomsString)
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

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
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
			}
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
			const date = new Date(exam.date);
			const dateString = date.getDate() + '-' + date.getMonth() + '-' + date.getFullYear();
			var time;
			if (exam.time == '2-5') {
				time = '2:00pm-5:00pm';
			} else {
				time = '9:00am-12noon';
			}
			await invigilators.forEach(async (invigilator) => {
				const newRow = {
					Date: dateString,
					Time: time,
					Course: course.bits_id,
					'Course Title': course.title,
					Disc: course.discipline,
					Name: invigilator.name,
					'Email Address': invigilator.email,
					'PSRN/System ID': invigilator.psrn_no,
					IC: ic
				};
				jsondata.push(newRow);
			});
		}
		//output2.generateOutput2(req.params.schedId);
		const ws = XLSX.utils.json_to_sheet(jsondata);
		const wb = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
		XLSX.writeFile(wb, 'output2.xlsx');
		var file = fs.readFileSync('output2.xlsx');
		res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
		res.setHeader('Content-Disposition', 'attachment; filename=' + 'output2.xlsx');
		res.end(file);
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
		const bitsId = req.params.bitsId;
		const courses = await statics.courses.findOne({
			where: { bits_id: bitsId },
			include: {
				model: statics.invigilators,
				through: {
					attributes: ['status']
				}
			}
		});

		if (!courses) {
			return res.status(400).json({
				msg: 'Not found. Pls check your course id entered :('
			});
		}

		const course_data = [
			['bits_id', courses.bits_id],
			['title', courses.title],
			['capacity', courses.capacity],
			['invigilators_required', courses.invigilators_required],
			['discipline', courses.discipline],
			['block', courses.block],
			['', '']
		];

		const invigilators = [];
		courses.invigilators.forEach((invigilator) => {
			const invigilator_data = {
				id: invigilator.id,
				name: invigilator.name,
				psrn_no: invigilator.psrn_no,
				dept: invigilator.dept,
				stat1: invigilator.stat1,
				stat2: invigilator.stat2,
				email: invigilator.email,
				duties_to_be_alloted: invigilator.duties_to_be_alloted,
				mobile: invigilator.mobile,
				assignedDuties: invigilator.assignedDuties,
				status: invigilator.courses_invigilators.status
			};
			invigilators.push(invigilator_data);
		});

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
		const duty_details = await statics.invigilators.findOne({
			where: { psrn_no: invigilatorId },
			include: [
				{
					model: sched.invigilatorsAlloted,
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

module.exports = {
	getOutput1: getOutput1,
	getOutput2: getOutput2,
	getOutput3: getOutput3,
	getOutput4: getOutput4
};

//s2ab method
function s2ab(s) {
	var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
	var view = new Uint8Array(buf); //create uint8array as viewer
	for (var i = 0; i < s.length; i++) view[i] = s.charCodeAt(i) & 0xff; //convert to octet
	return buf;
}
