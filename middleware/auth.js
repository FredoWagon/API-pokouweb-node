const jwt = require('jsonwebtoken');
const {catchAsync} = require('../lib/utils')
const User = require('../models/user')

module.exports = catchAsync (async (req, res, next) => {
    const token = req.cookies.user
    if (token) {
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN');
        const user = await User.findOne({id: decodedToken.id})

        if (user.id === decodedToken.userId) {
            console.log('on est bon')
            next();
        } else {
            res.redirect('/')
        }
    } else {
        res.redirect('/')
    }



});