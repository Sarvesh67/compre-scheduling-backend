const db = require('../database/db');
const fs = require('fs');

async function public_force() {
	// Populate courses
	const courses = JSON.parse(fs.readFileSync('compre-data/courses.json'));
	await db.public.statics.courses.bulkCreate(courses);

	// Populate invigilators
	const invigilators = JSON.parse(fs.readFileSync('compre-data/invigilators.json'));
	await db.public.statics.invigilators.bulkCreate(invigilators);

	// Populate unavailable dates
	const unavailableDates = JSON.parse(fs.readFileSync('compre-data/unavailable_dates.json'));
	await db.public.statics.unavailableDates.bulkCreate(unavailableDates);

	// Populate team members
	const teamMembers = JSON.parse(fs.readFileSync('compre-data/course_team_members.json'));
	await db.public.statics.teamMembers.bulkCreate(teamMembers);

	// Populate rooms
	const rooms = JSON.parse(fs.readFileSync('compre-data/room_data.json'));
	await db.public.statics.rooms.bulkCreate(rooms);

	return;
}

async function main(testing) {
	/* var schemas = [
          // SchemaName, force_param, force_function(to be executed in case, the force param is true)
          ['public', true, public_force],
          // ['atc', true, atc_force],
          // ['atc', true, atc_force]
      ], force_ret = 0; */
	if (!testing) console.log('Creating the tables');

	//
	await db.conn.sync({ force: testing });

	if (testing) {
		try{
			await public_force();
		}
		catch(e){
			console.log(e)
		}
	} else {
		console.log('\n\n\n\n\n');
	}
	return;
}

async function closeConn() {
	await db.conn.close();
	return;
}

if (require.main == module) {
	// For testing keep param true, will force sync all tables.
	main(true)
		.then(() => {
			console.log('Tables succesfully created!');
			closeConn()
				.then(() => console.log('Connection terminated succesfully!'))
				.catch((e) => {
					throw e;
				});
		})
		.catch((e) => {
			// console.log(e);
			throw e;
		});
	// eslint-disable-next-line no-undef
	process.exit[0];
}
