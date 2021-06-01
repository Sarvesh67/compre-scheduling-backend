/*eslint no-undef: "error"*/
/*eslint-env node*/

const express = require('express');
const helmet = require('helmet');
const xss = require('xss-clean');
const cors = require('cors');
const routes = require('./routes');

function Server() {
	const app = express();

	// Load middlewares here

	// Set security HTTP headers
	app.use(helmet());

	// Parse json request body
	app.use(express.json());

	// Parse urlencoded request body
	app.use(express.urlencoded({ extended: true }));

	// Sanitize request data
	app.use(xss());

	// enable cors
	app.use(cors());
	app.options('*', cors());

	// Load routes here
	app.use('/', routes);

	// Load error handler

	app.listen(5000, () => {
		console.log('Listening on port 5000. \nWelcome to the Compre Scheduling App!');
	});
}

// eslint-disable-next-line no-unused-vars
function Database() {
	// Connect Database here
}

if (require.main === module) {
	Server();
	Database();
}
