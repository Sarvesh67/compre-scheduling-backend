const XLSX = require('xlsx');
const fs = require('fs')

const db = require('../database/db')
const { Op } = require('sequelize')

const sched = db.public.schedules
const statics = db.public.statics

const getOutput1 = async (req, res) => {
    try {
        var jsondata = []
        scheduleId = req.params.schedId
        /**'
         * course - 
         * title - 
         * ic -
         * date - 
         * time - 
         * Rooms -
         * invigilators Required - 
         * invgilators Given -
         */

        const exams = await sched.exam.findAll({
            where:{
                date:{
                    [Op.not]: null
                },
                time: {
                    [Op.not]: null
                },
                schedule_id: scheduleId
            },
            include: [
                {
                    model: sched.examRoom,
                    include: [
                        sched.invigilatorsAlloted,
                        {
                            model: statics.rooms,
                            attributes: ['name']
                        }
                    ]
                }
            ]
        })

        for (const exam of exams){
            //console.log(exam)
            const course = await statics.courses.findOne({
                where:{
                    id: exam.course_id
                },
                include:[statics.invigilators]
            })
            const invigilators = course.invigilators;
            var ic;
            await invigilators.forEach(async (invigilator) => {
                if(invigilator.courses_invigilators.status == 'ic'){
                    ic = invigilator.name
                }
            })
            var roomsString = ""
            var invigilatorsGiven = 0
            for (const room of exam.exam_rooms){
                roomsString += room.room.name + "(" + room.capacity + "), "
                invigilatorsGiven += room.invigilatorsAlloteds.length
            }

            const date = new Date(exam.date);
            const dateString = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
            var time;
            if(exam.time == '2-5'){
                time = '2:00pm-5:00pm'
            }
            else{
                time = '9:00am-12noon'
            }
            //console.log(roomsString)
            newRow = {
                Course : course.bits_id,
                Title : course.title,
                IC : ic,
                Date : dateString,
                Time : time,
                Rooms : roomsString,
                "Invigilators Required" : course.invigilators_required,
                "Invigilators Given" : invigilatorsGiven
            }

            jsondata.push(newRow)
        }

        //console.log(jsondata)
        const ws = XLSX.utils.json_to_sheet(jsondata);
        const wb = XLSX.utils.book_new();
	    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
        XLSX.writeFile(wb , 'output1.xlsx');
        var file = fs.readFileSync('output1.xlsx')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "output1.xlsx");
        res.end(file);
    } catch (error) {
        console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
    }
}

const getOutput2 = async (req,res) =>{
    try {
        var jsondata = [];
        //Fetching data
        const scheduleId = req.params.schedId;
        //Get All exams where date and time is defined
        const exams = await sched.exam.findAll({
            where:{
                date:{
                    [Op.not]: null
                },
                time: {
                    [Op.not]: null
                },
                schedule_id: scheduleId
            }
        })
        for(const exam of exams){
            const course = await statics.courses.findOne({
                where:{
                    id: exam.course_id
                },
                include:[statics.invigilators]
            })
            const invigilators = course.invigilators;
            var ic;
            await invigilators.forEach(async (invigilator) => {
                if(invigilator.courses_invigilators.status == 'ic'){
                    ic = invigilator.name
                }
            })
            const date = new Date(exam.date);
            const dateString = date.getDate() + "-" + date.getMonth() + "-" + date.getFullYear();
            var time;
            if(exam.time == '2-5'){
                time = '2:00pm-5:00pm'
            }
            else{
                time = '9:00am-12noon'
            }
            await invigilators.forEach(async (invigilator) => {
                const newRow = {
                    Date: dateString,
                    Time: time,
                    Course: course.bits_id,
                    "Course Title" : course.title,
                    Disc: course.discipline,
                    Name: invigilator.name,
                    "Email Address" : invigilator.email,
                    "PSRN/System ID" : invigilator.psrn_no,
                    IC : ic
                }
                jsondata.push(newRow);
            })
        }
        //output2.generateOutput2(req.params.schedId);
        const ws = XLSX.utils.json_to_sheet(jsondata);
        const wb = XLSX.utils.book_new();
	    XLSX.utils.book_append_sheet(wb, ws, 'Schedule');
        XLSX.writeFile(wb , 'output2.xlsx');
        var file = fs.readFileSync('output2.xlsx')
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader("Content-Disposition", "attachment; filename=" + "output2.xlsx");
        res.end(file);
    } catch (error) {
        console.log(error);
		return res.status(500).json({
			msg: 'Internal server error :('
		});
    }
    
}

module.exports = {
    getOutput1: getOutput1,
    getOutput2: getOutput2,
}