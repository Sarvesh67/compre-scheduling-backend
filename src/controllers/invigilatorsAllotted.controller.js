// eslint-disable-next-line no-unused-vars
const e = require('express');
const db = require('../database/db');

const schedules = db.public.schedules;

const includeMetadata = {
    include: [
        {
            model: db.public.schedules.examRoom,
            include: [
                {
                    model: db.public.statics.rooms
                },
                {
                    model: db.public.schedules.exam
                }
            ]
        },
        {
            model: db.public.statics.invigilators
        }
    ]
}


/**
 *
 * @param {e.Request} req
 * @param {e.Response} res
 * @returns {Promise<e.Response>}
 */
const create = async (req, res) => {
	try {
		const invigilatorsAllotted = req.body;
		const invigilatorsAllottedSaved = await schedules.invigilatorsAlloted.create(invigilatorsAllotted);
		return res.status(200).json({
			msg: 'Invigilators Allotted Entry successfully created!',
			invigilatorsAllotted: invigilatorsAllottedSaved
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
		const invigilatorAlloted = await schedules.invigilatorsAlloted.findByPk(id, includeMetadata);
		return res.status(200).json({
			msg: 'Invigilators Allotted Entry successfully retrieved',
			invigilatorAlloted
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
		const invigilatorsAllotted = await schedules.invigilatorsAlloted.findAll({}, includeMetadata);
		return res.status(200).json({
			msg: 'Invigilators Allotted Entries successfully retrieved',
			invigilatorsAllotted
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
		const updatedInvigilatorsAllotted = await schedules.invigilatorsAlloted.update(update, { where: { id: id }, returning: true });
		return res.status(200).json({
			msg: 'Invigilators Allotted Entry updated successfully!',
			invigilatorAllotted: updatedInvigilatorsAllotted[1][0]
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
		await schedules.invigilatorsAlloted.destroy({ where: { id: id } });
		return res.status(200).json({
			msg: 'Invigilators Allotted Entry deleted successfully!'
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
