const e = require('express')
const db = require('../database/db')

const statics = db.public.statics

const getAll = async (req , res) => {
    try {
        const unavailableDates = await statics.unavailableDates.findAll({})
        return res.status(200).json({
            msg: 'Unavailable Dates Successfully Retrieved',
            unavailableDates: unavailableDates
        })
    } catch (error) {
        console.log(error)
        return res.status(500).json({
            msg: 'Internal Server Error :('
        })
    }
}

module.exports = {
    getAll: getAll
}