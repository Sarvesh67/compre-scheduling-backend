const express = require('express')
const db = require('../database/db')

const sched = db.public.schedules

const create = async (req, res) => {
    try {
        const newSched = req.body;  
        const user_id = req.params.userId;
        const user_count = await sched.user.findAll({
			where: {
				id: user_id
			}
		})
        if(user_count.length < 1){
			return res.status(200).json({
				msg: 'User DNE',
			});
		}
        else{
            const schedSaved = await sched.schedules.create(newSched)
			return res.status(200).json({
				msg: 'Schedule successfully created!',
				user: schedSaved
			});
        }
    } catch (error) {
        console.log(error)
		return res.status(500).json({
			msg: 'Bad Request'
		})
    }
}

const getAll = async (req, res) =>{
	try {
		const scheduleList = await sched.schedules.findAll({})
		return res.status(200).json({
			msg: 'Users successfully retireved',
			schedules: scheduleList
		})
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
}

const update = async (req, res) => {
	try {
		const update = req.body;
		const id = req.params.id;
		const updatedSchedule = await sched.schedules.update(update, { where: { id: id }, returning: true });
		return res.status(200).json({
			msg: 'Schedule Details Successfully updated!',
			exam: updatedSchedule[1][0]
		});
	} catch (e) {
		console.log(e);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
};

const deleteSched = async (req, res) => {
    try {
        await sched.schedules.destroy({
			where: {
				id: req.params.id
			}
		});
		return res.status(200).json({
			msg: 'Schedule Successfully Deleted'
		})
    } catch (error) {
        console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
    }
}

module.exports = {
    create: create,
    getAll: getAll,
    delete: deleteSched,
    update: update
};