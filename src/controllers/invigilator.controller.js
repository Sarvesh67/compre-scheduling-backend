// eslint-disable-next-line no-unused-vars
const e = require('express');
const db = require('../database/db');

const statics = db.public.statics;

/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const create = async (req, res) => {
	try {
		const invigilator = req.body;
		const invigilatorsaved = await statics.invigilators.create(invigilator);
		return res.status(200).json({
			msg: 'Invigilator successfully created!',
			invigilator: invigilatorsaved
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
		const invigilator = await statics.invigilators.findByPk(id);
		return res.status(200).json({
			msg: 'Invigilator successfully retrieved',
			invigilator: invigilator
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
		const invigilators = await statics.invigilators.findAll({});
		return res.status(200).json({
			msg: 'Invigilator successfully retrieved',
			invigilator: invigilators
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
		const updatedInvigilator = await statics.invigilators.update(update, { where: { id: id }, returning: true });
		return res.status(200).json({
			msg: 'Invigilator updated successfully!',
			invigilator: updatedInvigilator[1][0]
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
		await statics.invigilators.destroy({ where: { id: id } });
		return res.status(200).json({
			msg: 'Invigilator deleted successfully!'
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
