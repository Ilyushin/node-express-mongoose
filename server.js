'use strict';

const https = require('https'),
    fs = require('fs'),
    path = require('path'),
    express = require('express'),
    compression = require('compression'),
    app = express(),
    passport = require('passport'),
    bodyParser = require('body-parser'),
    mongoose = require('mongoose'),
    settings = require('./settings.js'),
    winston = require('winston'), //logger for errors
    db = mongoose.connection,   
    router = express.Router();// get an instance of the express Router

//Settings for winston
const filename_info = path.join(__dirname, './log/filelog-info.log'),
    filename_err = path.join(__dirname, './log/filelog-error.log'),
    filename_exceptions = path.join(__dirname, './log/filelog-exceptions.log');
    
const logger = new (winston.Logger)({
    transports: [
        new (winston.transports.File)({
            name: 'info-file',
            filename: filename_info,
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: filename_err,
            level: 'error'
        }),
        new (winston.transports.Console)()
    ],
    exceptionHandlers: [
      new winston.transports.File({ filename: filename_exceptions })
    ]
});         

//Creating folders for static content
fs.existsSync("static") || fs.mkdirSync("static");

//Use compression
app.use(compression());

/*Configuring Body-parser
configure app to use bodyParser()
this will let us get the data from a POST*/
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//Configuring Mongose
mongoose.Promise = global.Promise;
mongoose.connect(settings.url_db, settings.options);

//Check connection to DB
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  logger.info("Connect to DB is success.")
});

//Init models
['user'].forEach((model) => {
    require('./models/' + model)(mongoose);
});

const authController = require('./controllers/authentication')(mongoose, passport, logger),
    userController = require('./controllers/user')(mongoose, logger);

//Configuring Passport
require('./config/passport')(app, mongoose, passport);

//Configuring Morgan(logging for the app)
require('./config/morgan')(app, fs, path, __dirname);

app.use(function(req,res,next){
    const cluster = require('cluster');
    if(cluster.isWorker) logger.info(`Core ${cluster.worker.id} got a query`);    
    next();
});


 /*ROUTES 
 =============================================================================
 all of our routes will be prefixed with */
app.use('/', router);

// User page 404
app.use(function (req, res) {
    res.type('text/plain');
    res.status(404);
    res.send('404 — Not Found');
});

// User page 500
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 — Internal server error');
});

function startServer() {
    switch(app.get('env')){
    case 'development':
        app.listen(settings.port, ()=> logger.info('Listen '+settings.port+' port'));
        break;
    case 'production':
        https.createServer(options_https, app).listen(settings.port, ()=> logger.info('Listen '+settings.port+' port'));
        break;
    }    
}

if(require.main === module) startServer();
else module.exports = startServer;
