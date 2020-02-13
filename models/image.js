const Sequelize = require('sequelize');

const sequelize = require('../utils/database');

const Image = sequelize.define('image', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    imageUrl: {
        type: Sequelize.STRING,
        allowNull: false,
        field: "image_url"
    },
    isPrivate: {
        type: Sequelize.BOOLEAN,
        defaultValue: 0
    },
    createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    },
    updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
        allowNull: false
    }
}, {
    timestamps: true,
    underscored: true
});

module.exports = Image;