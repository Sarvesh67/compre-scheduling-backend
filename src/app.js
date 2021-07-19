/*eslint no-undef: "error"*/
/*eslint-env node*/

const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const routes = require('./routes');
const db = require('./database/db');

async function Server() {
	const app = express();

	// Load middlewares here

	// Set security HTTP headers
	app.use(helmet());

	// Parse json request body
	app.use(express.json({ limit: "5mb" }));

	// Parse urlencoded request body
	app.use(express.urlencoded({ extended: true, limit: "5mb" }));

	// Sanitize request data
	app.use(xss());

	// enable cors
	app.use(cors());
	app.options('*', cors());

	// Load routes here
	app.use('/', routes);

	// Load error handler

	app.listen(process.env.PORT || 5000, () => {
		console.log('Listening on port 5000. \nWelcome to the Compre Scheduling App!');
	});

	app.on('error', (e) => {
		throw e;
	});
}

function Database() {
	// Test connectivity
	return db.connectDb();
}

if (require.main === module) {
	// Run Express App
	Server().catch((e) => {
		console.log(e);
	});

	// Run Database
	Database().catch((e) => {
		console.log(e);
	});
}
