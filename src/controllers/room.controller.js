const e = require('express');
const db = require('../database/db');

const rooms = db.public.statics.rooms;
/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
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
	getAll: getAll
};
