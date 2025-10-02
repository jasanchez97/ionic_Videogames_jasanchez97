const express = require('express');
const router = express.Router();
const multer = require('multer');
const gameController = require('../controllers/game.controller');

const upload = multer();

router.post('/', upload.any(), gameController.create);
router.get('/', gameController.findAll);
router.get('/:id', gameController.findOne);
router.put('/:id', upload.any(), gameController.update);
router.delete('/:id', gameController.delete);

module.exports = router;