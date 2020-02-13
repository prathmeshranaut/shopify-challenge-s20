const path = require('path');
const express = require('express');
const sequelize = require('./utils/database');
const bodyParser = require('body-parser');
const imageRoutes = require('./routes/image');
const authRoutes = require('./routes/auth');

const User = require('./models/user');
const Image = require('./models/image');

const app = express();

app.use(bodyParser.json());

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS')
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    next();
});

app.use('/image', imageRoutes);
app.use('/auth', authRoutes);

app.use((err, req, res, next) => {
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    const error = err.error;

    res.status(status).json({message: message, error: error})
});

// Model Relations
Image.belongsTo(User, {constraints: true, onDelete: 'CASCADE'});
User.hasMany(Image);

sequelize.sync().then(result => {
    app.listen(3000, () => {
        console.log('Server is up on 3000');
    });
}).catch(err => {
    console.log(err);
});

