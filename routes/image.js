const express = require('express');
const router = express.Router();
const {body} = require('express-validator');
const multer = require('multer');
const uuidv4 = require('uuid/v4');
const path = require('path');
const isAuth = require('../middleware/auth');
const imageController = require('../controllers/image');

/*****************************************
 * Configuration options for Multer
 ******************************************/
const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    if (
        file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg'
    ) {
        cb(null, true);
    } else {
        cb(null, false);
    }
};
const upload = multer({storage: fileStorage, fileFilter: fileFilter});



// GET /image
router.get('/', isAuth, imageController.getImages);

// POST /image/create
router.post('/create', isAuth, [upload.single('image'),
    body('title').trim().isLength({min: 3})
], imageController.createImage);

router.post('/create-bulk', isAuth, [upload.array('image', 5),
    body('title').trim().isLength({min: 3})
], imageController.createImageBulk);

router.get('/:imageId', isAuth , imageController.getImage);

router.delete('/:imageId', isAuth, imageController.deleteImage);

module.exports = router;