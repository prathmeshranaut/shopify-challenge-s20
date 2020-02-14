const {validationResult} = require('express-validator');
const Image = require('../models/image');
const {Op} = require("sequelize");
const fs = require('fs');
const path = require('path');
const mime = require('mime');
const {errorFunction} = require('../utils/common');

/**
 * Handles API route which returns all images
 * that can be viewed by the current user.
 */
exports.getImages = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const perPage = 2;

    Image.findAll({
        where: {
            [Op.or]: [
                {isPrivate: 0},
                {isPrivate: 1, userId: req.user.id}
            ]
        },
        limit: perPage,
        offset: (currentPage - 1) * perPage
    }).then(images => {
        res.status(200).json({images: images})
    }).catch(err => errorFunction(err, next));
};

/**
 * Creates a new image for the given user.
 */
exports.createImage = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        throw error;
    }

    if (!req.file) {
        const error = new Error('No image uploaded');
        error.statusCode = 422;
        throw error;
    }

    const imageUrl = req.file.path;
    const isPrivate = req.body.isPrivate || 0;

    req.user.createImage({
        title: req.body.title,
        imageUrl: imageUrl,
        isPrivate: isPrivate
    }).then(image => {
        res.status(201).json({
            message: 'Image added successfully',
            image: image
        });
    }).catch(err => errorFunction(err, next));
};

/**
 * Handles bulk upload of images for the current user
 */
exports.createImageBulk = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        throw error;
    }

    if (req.files.length < 1) {
        const error = new Error('No image uploaded');
        error.statusCode = 422;
        throw error;
    }

    var images = [];

    req.files.forEach((image) => {
        const imageUrl = image.path;
        const isPrivate = req.body.isPrivate || 0;

        images.push({
            title: req.body.title,
            imageUrl: imageUrl,
            isPrivate: isPrivate,
            userId: req.user.id
        });
    });

    Image.bulkCreate(images).then(image => {
        res.status(201).json({
            message: 'Image added successfully',
            images: image
        });
    }).catch(err => errorFunction(err, next));
};

/**
 * Renders the image for a given imageId
 */
exports.getImage = (req, res, next) => {
    const imageId = req.params.imageId;

    Image.findOne({
        where: {
            id: imageId, [Op.or]: [
                {isPrivate: 0},
                {isPrivate: 1, userId: req.user.id}
            ]
        }
    })
        .then(image => {
            if (!image) {
                const error = new Error('Could not find image.');
                error.statusCode = 404;
                throw error;
            }

            const imageFile = path.join(__dirname, '../' + image.imageUrl);

            fs.readFile(imageFile, function (err, content) {
                if (err) {
                    err.statusCode = 500;
                    throw err;
                }

                res.writeHead(200, {'Content-type': mime.getType(imageFile)});
                res.end(content);
            });
        })
        .catch(err => errorFunction(err, next));
};

/**
 * Deletes a single image provided it is by the user.
 */
exports.deleteImage = (req, res, next) => {
    const imageId = req.params.imageId;
    Image.findOne({
        where: {
            id: imageId,
            userId: req.user.id
        }
    })
        .then(image => {
            if (!image) {
                const error = new Error('Could not find image.');
                error.statusCode = 404;
                throw error;
            }

            clearImage(image.imageUrl);
            image.destroy();

            res.status(200).json({message: 'Deleted Image.'});
        })
        .catch(err => errorFunction(err, next))
};


const clearImage = filePath => {
    filePath = path.join(__dirname, '..', filePath);
    fs.unlink(filePath, err => console.log(err));
};