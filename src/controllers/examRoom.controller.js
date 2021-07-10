// eslint-disable-next-line no-unused-vars
const e = require('express');
const db = require('../database/db');

const schedules = db.public.schedules;
const rooms = db.public.statics.rooms;

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const create = async (req, res) => {
	try {
		const examRoom = req.body;
		const examRoomSaved = await schedules.examRoom.create(examRoom);
		return res.status(200).json({
			msg: 'Exam Room successfully created!',
			examRoom: examRoomSaved
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
const get = async (req, res) => {
	try {
		const id = req.params.id;
		const examRoom = await schedules.examRoom.findByPk(id, {
			include: [
				{
					model: rooms
				},
				{
					model: schedules.exam
				}
			]
		});
		return res.status(200).json({
			msg: 'Exam Room successfully retrieved',
			examRoom
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
		const examRooms = await schedules.examRoom.findByPk(id, {
			include: [
				{
					model: rooms
				},
				{
					model: schedules.exam
				}
			]
		});
		return res.status(200).json({
			msg: 'Exam Rooms successfully retrieved',
			examRooms
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
const update = async (req, res) => {
	try {
		const update = req.body;
		const id = req.params.id;
		const updatedExamRoom = await schedules.examRoom.update(update, { where: { id: id }, returning: true });
		return res.status(200).json({
			msg: 'Exam Room updated successfully!',
			exam: updatedExamRoom[1][0]
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
const destroy = async (req, res) => {
	try {
		const id = req.params.id;
		await schedules.examRoom.destroy({ where: { id: id } });
		return res.status(200).json({
			msg: 'Exam Room deleted successfully!'
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

module.exports = {
	create: create,
	get: get,
	getAll: getAll,
	update: update,
	delete: destroy
};
