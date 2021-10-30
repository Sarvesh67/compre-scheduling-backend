const db = require('../database/db');

const sched = db.public.schedules;
const statics = db.public.statics;

async function public_force() {
	// Populate users
	await sched.user.create({
		name: 'S1',
		email: 'S1@gmail.com',
		password: 'S1'
	});

	// Populate schedules
	const schedSaved = await sched.schedules.create({
		name: 'S1',
		user_id: '1',
		start_date: '2021-07-14T13:42:41.642Z',
		end_date: '2021-07-24T13:42:41.642Z',
		slots: ['9-10:30', '11-12:30'],
		slots_each_day: 2
	});

	const courses = await statics.courses.findAll({});
	const exams = [];
	courses.forEach(async (course) => {
		const exam = {
			schedule_id: schedSaved.id,
			course_id: course.id
		};
		exams.push(exam);
	});
	await sched.exam.bulkCreate(exams);

	// Populate exam dates for schedule 1
	await sched.exam.update(
		{
			time: '2-5',
			date: '2021-07-14T13:42:41.642Z'
		},
		{
			where: { id: 1 },
			returning: true
		}
	);
	await sched.exam.update(
		{
			time: '9-12',
			date: '2021-07-14T13:42:41.642Z'
		},
		{
			where: { id: 2 },
			returning: true
		}
	);
	await sched.exam.update(
		{
			time: '2-5',
			date: '2021-07-14T13:42:41.642Z'
		},
		{
			where: { id: 3 },
			returning: true
		}
	);

	// Populate exam rooms
	await sched.examRoom.create({
		exam_id: 1,
		room_id: 1,
		schedule_id: schedSaved.id,
		capacity: 20
	});
	await sched.examRoom.create({
		exam_id: 2,
		room_id: 1,
		schedule_id: schedSaved.id,
		capacity: 20
	});
	await sched.examRoom.create({
		exam_id: 2,
		room_id: 2,
		schedule_id: schedSaved.id,
		capacity: 40
	});
	await sched.examRoom.create({
		exam_id: 3,
		room_id: 3,
		schedule_id: schedSaved.id,
		capacity: 20
	});

	// Populate invigilator alloted
	await sched.invigilatorsAlloted.create({
		exam_room_id: 1,
		invigilators_id: 1,
		schedule_id: schedSaved.id
	});
	await sched.invigilatorsAlloted.create({
		exam_room_id: 2,
		invigilators_id: 1,
		schedule_id: schedSaved.id
	});
	await sched.invigilatorsAlloted.create({
		exam_room_id: 3,
		invigilators_id: 1,
		schedule_id: schedSaved.id
	});
	await sched.invigilatorsAlloted.create({
		exam_room_id: 4,
		invigilators_id: 2,
		schedule_id: schedSaved.id
	});
	await sched.invigilatorsAlloted.create({
		exam_room_id: 2,
		invigilators_id: 2,
		schedule_id: schedSaved.id
	});
	await sched.invigilatorsAlloted.create({
		exam_room_id: 3,
		invigilators_id: 2,
		schedule_id: schedSaved.id
	});

	return;
}

if (require.main == module) {
	public_force()
		.then(() => console.log('Dummy data populatd successfully!'))
		.catch((e) => {
			throw e;
		});
	// eslint-disable-next-line no-undef
	process.exit[0];
}
