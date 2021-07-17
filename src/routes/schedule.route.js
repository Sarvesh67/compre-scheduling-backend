const express = require('express')
const scheduleControllers = require('../controllers/schedule.controller');
const { route } = require('./user.route');

const router = express.Router()

router.post('/', scheduleControllers.getAll);
router.post('/create/:userId', scheduleControllers.create);
router.delete('/:id', scheduleControllers.delete);
router.put('/:id', scheduleControllers.update);
router.post('/:id', scheduleControllers.get);

module.exports = router;

/**
 * {
    "msg": "Schedule Retrieved Successfully",
    "schedule": {
        "id": "1",
        "user_id": "1"
    },
    "exams": [
        {
            "id": "1",
            "date": "2021-07-14",
            "time": "9-12",
            "createdAt": "2021-07-15T05:14:49.859Z",
            "updatedAt": "2021-07-15T05:14:49.859Z",
            "schedule_id": "1",
            "course_id": "1",
            "exam_rooms": [
                {
                    "id": "2",
                    "capacity": 19,
                    "createdAt": "2021-07-15T06:05:33.425Z",
                    "updatedAt": "2021-07-15T06:05:33.425Z",
                    "exam_id": "1",
                    "room_id": "3",
                    "invigilatorsAlloteds": [
                        {
                            "id": "2",
                            "createdAt": "2021-07-15T07:08:42.469Z",
                            "updatedAt": "2021-07-15T07:08:42.469Z",
                            "exam_room_id": "2",
                            "invigilators_id": "1"
                        }
                    ]
                }
            ]
        }
    ]
}
 */