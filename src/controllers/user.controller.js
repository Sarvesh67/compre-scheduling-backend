// const express = require('express');
const db = require('../database/db');

const schedules = db.public.schedules;

const create = async (req, res) => {
	try {
		const user = req.body;
		const user_count = await schedules.user.findAll({
			where: {
				email: user.email
			}
		});
		if (user_count.length > 0) {
			return res.status(200).json({
				msg: 'Email Already Exists'
			});
		} else {
			const usersaved = await schedules.user.create(user);
			return res.status(200).json({
				msg: 'User successfully created!',
				user: usersaved
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const getAll = async (req, res) => {
	try {
		const users = await schedules.user.findAll({});
		return res.status(200).json({
			msg: 'Users successfully retireved',
			users: users
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const login = async (req, res) => {
	try {
		const email = req.body.email;
		const pwd = req.body.password;
		const user = await schedules.user.findAll({
			where: {
				email: email,
				password: pwd
			}
		});
		if (user.length > 0) {
			return res.status(200).json({
				msg: 'Users successfully Logged In',
				user: user
			});
		} else {
			return res.status(401).json({
				msg: 'Unauthorized Access'
			});
		}
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const getSchedules = async (req, res) => {
	try {
		const id = req.body.userId;
		const sched = await schedules.schedules.findAll({
			where: {
				user_id: id
			}
		});
		return res.status(200).json({
			msg: 'Schedules Retireved',
			sched
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const purgeAll = async (req, res) => {
	try {
		await schedules.user.destroy({
			where: {}
		});
		return res.status(200).json({
			msg: 'All users purged'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const deleteUser = async (req, res) => {
	try {
		await schedules.user.destroy({
			where: {
				id: req.params.id
			}
		});
		return res.status(200).json({
			msg: 'User Purged'
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

module.exports = {
	create: create,
	getAll: getAll,
	login: login,
	purgeAll: purgeAll,
	deleteUser: deleteUser,
	getSchedules: getSchedules
};
