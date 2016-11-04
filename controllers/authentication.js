'use strict';

module.exports = (mongoose, passport) => {
  // Load required packages  
  const BasicStrategy = require('passport-http').BasicStrategy,
    User = mongoose.model('User');

  passport.use(new BasicStrategy((username, password, callback) => {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return callback(err); }

      // No user found with that username
      if (!user) { return callback(null, false); }

      // Make sure the password is correct
      user.verifyPassword(password, function (err, isMatch) {
        if (err) { return callback(err); }

        // Password did not match
        if (!isMatch) { return callback(null, false); }

        // Success
        return callback(null, user);
      });
    });
  }
  ));

  return { isAuthenticated: passport.authenticate('basic', { session: true }) };
}
