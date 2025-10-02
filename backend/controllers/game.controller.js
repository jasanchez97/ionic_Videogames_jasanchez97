const db = require("../models");
const Game = db.game;
const Op = db.Sequelize.Op;

let games = [];

exports.create = (req, res) => {
    console.log('=== DATA RECEIVED IN BACKEND ===');
    console.log('Body:', req.body);
    
    if (!req.body.name || !req.body.developer || !req.body.releaseDate || !req.body.category) {
        return res.status(400).json({
            message: "Required fields are missing: name, developer, releaseDate, category"
        });
    }

    const game = {
        name: req.body.name,
        subtitle: req.body.subtitle || '',
        developer: req.body.developer,
        releaseDate: req.body.releaseDate,
        category: req.body.category,
        stock: parseInt(req.body.stock) || 0
    };

    Game.create(game)
        .then(data => {
            res.status(201).json({
                message: "Game created successfully",
                game: data
            });
        })
        .catch(err => {
            res.status(500).json({
                message: err.message || "Error creating the game."
            });
        });
};

exports.findAll = (req, res) => {
    Game.findAll()
        .then(data => {
            res.send(data);
        })
        .catch(err => {
            res.status(500).send({
                message: err.message || "Some error occurred while retrieving games."
            });
        });
};

exports.findOne = (req, res) => {
    const id = req.params.id;

    Game.findByPk(id)
        .then(data => {
            if (data) {
                res.send(data);
            } else {
                res.status(404).send({
                    message: `Cannot find Game with id=${id}.`
                });
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Error retrieving Game with id=" + id
            });
        });
};

exports.update = (req, res) => {
    const id = req.params.id;

    Game.update(req.body, {
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Game was updated successfully."
            });
        } else {
            res.send({
                message: `Cannot update Game with id=${id}. Maybe Game was not found or req.body is empty!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Error updating Game with id=" + id
        });
    });
};

exports.delete = (req, res) => {
    const id = req.params.id;

    Game.destroy({
        where: { id: id }
    })
    .then(num => {
        if (num == 1) {
            res.send({
                message: "Game was deleted successfully!"
            });
        } else {
            res.send({
                message: `Cannot delete Game with id=${id}. Maybe Game was not found!`
            });
        }
    })
    .catch(err => {
        res.status(500).send({
            message: "Could not delete Game with id=" + id
        });
    });
};