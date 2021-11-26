var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const dashboardRouter = require('./routes/dashboard')
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env' });
const { AppError, sendErrorHandler, catchAsync } = require('./lib/utils');
var sassMiddleware = require('node-sass-middleware');
const clientRouter = require('./routes/client')
const cron = require('node-cron');
const Client = require('./models/client')
const {mail} = require('./lib/nodemailer')

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

const connectDB = catchAsync(async () => {
    await mongoose.connect(process.env.DATABASE,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
    console.log('Connexion à MongoDB réussie !')
})


const connectDB = (async () => {
  try {
    await mongoose.connect(process.env.DATABASE,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true
        });
    console.log('Connexion à MongoDB réussie !')
  } catch (e) {
    console.log('Connexion à MongoDB échoué !' + e)

  }

})

connectDB();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
var srcPath = __dirname + '/public/sass';
var destPath = __dirname + '/public/styles';

app.use('/styles', sassMiddleware({
    src: srcPath,
    dest: destPath,
    debug: true,
    outputStyle: 'expanded'
}));

var task = cron.schedule('* * * * *',() => {
    Client.mail_not_sent().then((values) => {
        if (values[0]) {
            const nextAvailableClient = values[0]
            console.log(nextAvailableClient.email)
            mail(nextAvailableClient).then(() => {
                console.log('Email envoyé')
                Client.findOneAndUpdate({email: nextAvailableClient.email}, {mail_sent: true})
                    .then(() => {
                        console.log('Client enlevé de la liste')

                }).catch((e) => {
                    console.log(`Le client n'a pas été enlevé de la liste :${e.message}`)
                } )

            }).catch((e) => {
                console.log(`Erreur envoi de mail: ${e.message}`)
            })
        } else {
            console.log('Liste des clients vide !')
        }

    }).catch((e) => (
        console.log(e)
    ))
});
task.start()


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/simpleEmail', (req,res,next) => {
    res.render('simpleEmail')
})

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dashboard', dashboardRouter);
app.use('/client', clientRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

app.use(sendErrorHandler);

module.exports = app;
