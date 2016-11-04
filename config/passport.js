'use strict';

module.exports = (app, mongoose, passport) => {

    //Configuring Passport
    const User = mongoose.model('User');

    const expressSession = require('express-session'),
        sessionOption = {
            secret: '8BP3P0lfNv2vf5LknNh65E8Nqa716K62',
            resave: true,
            saveUninitialized: true,
            cookie: {}
        };

    if (app.get('env') === 'production') {
        app.set('trust proxy', 1) // trust first proxy
        sessionOption.cookie.secure = true // serve secure cookies
    }

    app.use(expressSession(sessionOption));
    app.use(passport.initialize());
    app.use(passport.session());

    // serialize sessions
    passport.serializeUser((user, done) => done(null, user.id));
    passport.deserializeUser((id, done) => {
        User.findById(id, (err, user) => done(err, user));
    });
};