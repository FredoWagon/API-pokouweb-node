const mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');
// const { DateTime } = require("luxon");


const clientSchema = mongoose.Schema({
    name: { type: String},
    email: { type: String, required: true, unique: true, match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    mail_sent: {type: Boolean, default: false},
    website: {type: String},
},{ timestamps: true });


clientSchema.statics.mail_sent = function () {
    return this.find({ mail_sent: true }).sort({ createdAt: -1 });
};

clientSchema.statics.mail_not_sent = function () {
    return this.find({ mail_sent: false }).sort({ createdAt: -1 });
};
clientSchema.plugin(uniqueValidator);

module.exports = mongoose.model('Client', clientSchema);
