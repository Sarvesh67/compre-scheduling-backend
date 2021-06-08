const db = require('../database/db');

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

	if (!testing) console.log('\n\n\n\n\n');
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
			throw e;
		});
}
