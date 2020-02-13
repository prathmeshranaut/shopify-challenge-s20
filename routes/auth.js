const express = require('express');
const {body} = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put('/signup', [
    body('username').trim()
        .isLength({min: 3})
        .withMessage('Please enter a valid username.')
        .custom((value, {req}) => {
            return User.findOne({where: {username: value}})
                .then(user => {
                    if (user) {
                        return Promise.reject('Username already exists');
                    }
                })
        }),
    body('password').trim().isLength({min: 5})
], authController.signup);

router.post('/login', authController.login);

module.exports = router;