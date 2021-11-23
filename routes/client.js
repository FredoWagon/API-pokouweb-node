var express = require('express');
var router = express.Router();
const { catchAsync } = require('../lib/utils')
const Client = require('../models/client')
const {mail} = require('../lib/nodemailer')

/* GET home page. */
router.post('/', catchAsync(async (req, res, next) => {
    const input = req.body
    const result = await Client.insertMany(input, {ordered: false})
     const count = result.length

    //await Client.deleteMany({})

    res.json({count})
}));

router.post('/client_json', catchAsync(async (req, res, next) => {
    const input = req.body
    const result = await Client.insertMany(input, {ordered: false})
    const count = result.length
    res.json({count})
}));

router.post('/get_client', catchAsync( async (req, res, next) => {
    const input = req.body
    console.log(` input: ${typeof (input)}`)
    console.log(req.body)
   const clientFromDB = await Client.findOne(input)
    let value = ""
    if (clientFromDB) {
       value = clientFromDB.mail_sent
    } else {
        value = "Client non existant"
    }
    res.json({value})


} )   )

router.post('/send_direct', catchAsync( async (req, res, next) =>{
    const input = req.body
    mail(input).then(() => {
        console.log('Email envoyé')
        Client.findOneAndUpdate({email: input.email}, {mail_sent: true})
            .then((client) => {
                if (client) {
                    console.log('Client mis à jour')
                    res.json({value: true})
                } else {
                    Client.create({email: input.email, name: input.name, website: input.website, mail_sent: true})
                        .then(() => {
                            console.log('Client créé')
                            res.json({value: true})
                        })
                        .catch((e) => {
                            console.log(` Erreur : ${e.message}`)
                            res.json({value: false})
                        })
                }
            }).catch((e) => {
            console.log(` Erreur : ${e.message}`)
            res.json({value: false})
        } )
    }).catch((e) => {
        console.log(`Erreur envoi de mail: ${e.message}`)
        res.json({value: false})
    })

} ))

module.exports = router;
