'use strict';

module.exports = (app) => {
    app.use((req, res, next) => {
            res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
            next();
    });
}