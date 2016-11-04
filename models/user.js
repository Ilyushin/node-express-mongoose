'use strict';

module.exports = (mongoose) => {
    const bcrypt = require('bcrypt-nodejs');
    const Schema = mongoose.Schema;

    const UserSchema = new Schema({
        username: { type: String, default: '', trim: true, unique: true, required: true },
        email: { type: String, default: '', trim: true, unique: true, required: true },
        password: { type: String, default: '', trim: true, required: true }
    });

    // Execute before each user.save() call
    UserSchema.pre('save', function (callback) {
        let user = this;

        // Break out if the password hasn't changed
        if (!user.isModified('password')) return callback();

        // Password changed so we need to hash it
        bcrypt.genSalt(5, function (err, salt) {
            if (err) return callback(err);

            bcrypt.hash(user.password, salt, null, function (err, hash) {
                if (err) return callback(err);
                user.password = hash;
                callback();
            });
        });
    });

    UserSchema.methods.verifyPassword = function (password, cb) {
        bcrypt.compare(password, this.password, function (err, isMatch) {
            if (err) return cb(err);
            cb(null, isMatch);
        });
    };

    return mongoose.model('User', UserSchema);
}