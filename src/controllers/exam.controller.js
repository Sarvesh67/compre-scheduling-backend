// eslint-disable-next-line no-unused-vars
const e = require('express');
const db = require('../database/db');

const schedules = db.public.schedules;
// const statics = db.public.statics;

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const create = async (req, res) => {
	try {
		const exam = req.body;
		const examsaved = await schedules.exam.create(exam);
		return res.status(200).json({
			msg: 'Exam successfully created!',
			exam: examsaved
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
		const exam = await schedules.exam.findByPk(id);
		return res.status(200).json({
			msg: 'Exam successfully retrieved',
			exam: exam
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
		const exams = await schedules.exam.findAll({});
		return res.status(200).json({
			msg: 'Exam successfully retrieved',
			exam: exams
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
		const updatedExam = await schedules.exam.update(update, { where: { id: id }, returning: true });
		return res.status(200).json({
			msg: 'Exam updated successfully!',
			exam: updatedExam[1][0]
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
		await schedules.exam.destroy({ where: { id: id } });
		return res.status(200).json({
			msg: 'Exam deleted successfully!'
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
