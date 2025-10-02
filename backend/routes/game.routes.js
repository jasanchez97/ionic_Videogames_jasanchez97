module.exports = app => {
    const games = require("../controllers/game.controller.js");
    const express = require('express');
    const router = express.Router();
    const multer = require('multer');

    // Configurar multer para manejar FormData
    const upload = multer();

    router.post('/', upload.none(), gameController.create);

    router.get("/", games.findAll);

    router.get("/:id", games.findOne);

    router.put("/:id", games.update);

    router.delete("/:id", games.delete);

    app.use('/api/games', router);
};