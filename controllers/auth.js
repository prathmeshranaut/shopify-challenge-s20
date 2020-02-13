const {validationResult} = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const {errorFunction} = require('../utils/common');
const config = require('../config/config');
const User = require('../models/user');

exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed');
        error.statusCode = 422;
        error.error = errors.array();
        throw error;
    }
    const username = req.body.username;
    const password = req.body.password;

    bcrypt.hash(password, 8)
        .then(hashedPassword => {
            return User.create({
                username: username,
                password: hashedPassword
            });
        })
        .then(result => {
            res.status(201).json({message: 'User Created', userId: result.id});
        })
        .catch(err => errorFunction(err, next));
};

exports.login = (req, res, next) => {
    const username = req.body.username;
    const password = req.body.password;
    let loadedUser;
    User.findOne({ where: {username: username}})
        .then(user => {
            if (!user) {
                const error = new Error('User with the username could not be found.');
                error.statusCode = 404;
                throw error;
            }
            console.log(user);
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('Wrong password!');
                error.statusCode = 401;
                throw error;
            }

            const token = jwt.sign({
                    username: loadedUser.username,
                    id: loadedUser.id
                },
                config.jwtSecret,
                {expiresIn: '1d'});

            res.status(200).json({token: token, userId: loadedUser.id})
        })
        .catch(err => errorFunction(err, next));
};