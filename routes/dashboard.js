var express = require('express');
var router = express.Router();
const { catchAsync } = require('../lib/utils')
const Client = require('../models/client')
const auth = require('../middleware/auth')

/* GET users listing. */
router.get('/', auth, catchAsync(async (req, res, next) => {
    const sent_client = await Client.mail_sent();
    const not_sent_client = await Client.mail_not_sent();
    const client_length = await Client.find({}).sort({ createdAt: -1 });
    const date = new Date();
    const current_time = date.getHours();
    console.log(current_time)
    let time_before_done = ""

    const getTimeToSend = (params) => {
        const send_duration = not_sent_client.length * 7
        const hour_before_done = Math.round(send_duration / 60)
        console.log(hour_before_done)
        if (hour_before_done <= params) {
            return `${hour_before_done} heure(s)`
        } else {
            const days = Math.round(hour_before_done / 10)
            const hours = hour_before_done[1]
            return `${days} jour(s), ${hours} heure(s)`
        }
    }

    if (current_time < 8 || current_time >= 18) {

         time_before_done = getTimeToSend(10)
    } else {
        const newValue = 10 - (current_time - 8)
        time_before_done = getTimeToSend(newValue)
    }





    res.render('dashboard', {title: "API-Pokou | Dashboard", allClient: client_length, client_length: client_length.length, not_sent_client: not_sent_client.length, sent_client: sent_client.length, hour: current_time, time_before_done: time_before_done});
}));






module.exports = router;
