var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt')
const User = require('../models/user')

/* GET home page. */
router.get('/', function(req, res, next) {

  res.render('index')

});

module.exports = router;
