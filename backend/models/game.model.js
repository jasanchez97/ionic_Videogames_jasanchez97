module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        developer: {
            type: Sequelize.STRING
        },
        releaseDate: {
            type: Sequelize.DATEONLY
        },
        category: {
            type: Sequelize.STRING
        }
    });
    return Game;
};