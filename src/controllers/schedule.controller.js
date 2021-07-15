const express = require('express')
const db = require('../database/db')
const { statics } = require('../database/models/model')
const invigilatorsAlloted = require('../database/models/schedule/invigilatorsAlloted')

const sched = db.public.schedules
const stat = db.public.statics

const create = async (req, res) => {
    try {
        const newSched = req.body;  
        const user_id = req.params.userId;
		newSched.user_id = user_id
		// newSched.start_date = new Date(newSched.start_date);
		// newSched.end_date = new Date(newSched.end_date);
		console.log(newSched)
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
			const courses = await statics.courses.findAll({});
			courses.forEach(async (course) => {
				exam = {
					schedule_id: schedSaved.id,
					course_id: course.id
				};
				const examsaved = await sched.exam.create(exam);
			})
			return res.status(200).json({
				msg: 'Schedule successfully created!',
				user: schedSaved
			});
        }
    } catch (error) {
        console.log(error)
		return res.status(500).json({
			msg: 'Internal Server Error :('
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

const get = async(req, res) => {
	try {
		const id = req.params.id;
		const schedule = await sched.schedules.findByPk(id);
		const exams = await sched.exam.findAll({
			where:{
				schedule_id: schedule.id
			},
			include: [{
				model: sched.examRoom,
				include: [
					statics.rooms,
					{
						model: sched.invigilatorsAlloted,
						include: [
							statics.invigilators
						]
					}
				]
			},
			statics.courses
		]
		})
		return res.status(200).json({
			msg: 'Schedule Retrieved Successfully',
			schedule: schedule,
			exams: exams
		});
	} catch (error) {
		console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
	}
}

const update = async (req, res) => {
	try {
		const updateSched = req.body.schedule;
		const id = req.params.id;
		const exam = req.body.exam;
		const updatedSchedule = await sched.schedules.update(updateSched, { where: { id: id }, returning: true });
		id = exam.id;
		const updatedExam = await sched.exam.update(updateExam, {
			where: {
				id : id
			},
			returning: true
		});
		return res.status(200).json({
			msg: 'Schedule Details Successfully updated!',
			schedule: updatedSchedule[1][0],
			exam: updatedExam[1][0]
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
    update: update,
	get: get
};