// eslint-disable-next-line no-unused-vars
const e = require('express');
const db = require('../database/db');

const rooms = db.public.statics.rooms;
/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */

const create = async (req, res) => {
	try {
		const room = req.body;
		const roomsaved = await rooms.create(room);
		res.status(200).json({
			msg: 'Room successfully created!',
			course: roomsaved
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const get = async (req, res) => {
	try {
		const id = req.params.id;
		const room = await rooms.findByPk(id);
		return res.status(200).json({
			msg: 'Room successfully retrieved',
			room
		});
	} catch (e) {
		console.log(e);
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
const getAll = async (req, res) => {
	try {
		const roomData = await rooms.findAll({});
		return res.status(200).json({
			msg: 'Rooms successfully retrieved',
			rooms: roomData
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

module.exports = {
	get: get,
	getAll: getAll,
	create: create
};
