'use strict';

const FileStreamRotator = require('file-stream-rotator'),
    morgan = require('morgan');    

module.exports = (app, fs, path, dirname) => {
    const logDirectory = path.join(dirname, 'log');
    // ensure log directory exists
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory);
    // create a rotating write stream
    const accessLogStream = FileStreamRotator.getStream({
        date_format: 'YYYYMMDD',
        filename: path.join(logDirectory, 'access-%DATE%.log'),
        frequency: 'daily',
        verbose: false
    });
    // setup the logger
    app.use(morgan('combined', { stream: accessLogStream }));
};