'use strict';

module.exports = (mongoose, logger) => {
    // Load required packages
    const User = mongoose.model('User');

    return {
        // Create endpoint /users for POST
        postUsers: (req, res) => {
            let user = new User({
                username: req.body.username,
                email: req.body.email,
                password: req.body.password
            });

            user.save((err) => {
                if (err) {
                    logger.error(err.toString());
                    return res.send({ message: "fail" });
                }
                res.json({ message: 'success' });
            });
        }
    }    
}