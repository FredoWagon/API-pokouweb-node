var express = require('express');
var router = express.Router();
const { catchAsync } = require('../lib/utils')
const User = require('../models/user')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
var cookieParser = require('cookie-parser')

/* GET users listing. */


router.post('/login', catchAsync( async (req, res, next) => {
  console.log(req.body)
  const user = await User.findOne({email: req.body.email})
  console.log(req.body.password)
  console.log(user.password)
  if (user) {
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    console.log(validPassword)
    if (validPassword) {
      const token = jwt.sign({userId: user.id}, 'RANDOM_TOKEN', {expiresIn: '24h'})

      res.cookie("user", token, {maxAge: 900000} )
    }
    res.json({caca: "boup"})

  } else {
    console.log("utilisateur non trouvé")
  }


}))

module.exports = router;
