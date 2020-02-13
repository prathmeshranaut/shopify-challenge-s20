const jwt = require('jsonwebtoken');
const config = require('../config/config');
const User = require('../models/user');
const {errorFunction} = require('../utils/common');

module.exports = (req, res, next) => {
    let decodedToken;
    const authHeader = req.get('Authorization');
    if(!authHeader) {
        const error = new Error('Not authenticated.');
        error.statusCode = 401;
        throw error;
    }

    const token = authHeader.split(' ')[1];

    try {
        decodedToken = jwt.verify(token, config.jwtSecret);
    } catch (err) {
        err.statusCode = 500;
        throw err;
    }

    if (!decodedToken) {
        const error = new Error('Not authentication');
        error.statusCode = 401;
        throw error;
    }

    User.findByPk(decodedToken.id)
        .then(user => {
            if (!user) {
                const error = new Error('User not found');
                error.statusCode = 404;
                throw error;
            }
            req.user = user;
            next();
        })
        .catch(err => errorFunction(err, next));

    req.userId = decodedToken.userId;

};