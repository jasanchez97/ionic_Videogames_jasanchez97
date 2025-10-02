module.exports = (sequelize, Sequelize) => {
    const Game = sequelize.define("game", {
        name: {
            type: Sequelize.STRING
        },
        subtitle: {
            type: Sequelize.STRING
        },
        developer: {
            type: Sequelize.STRING
        },
        releaseDate: {
            type: Sequelize.DATEONLY,
            get() {
                const rawValue = this.getDataValue('releaseDate');
                if (!rawValue) return null;

                // Convert YYYY-MM-DD (BD) to DD/MM/YYYY (Spain)
                const date = new Date(rawValue);
                const day = String(date.getDate()).padStart(2, '0');
                const month = String(date.getMonth() + 1).padStart(2, '0');
                const year = date.getFullYear();

                return `${day}/${month}/${year}`;
            },
            set(value) {
                if (!value) return this.setDataValue('releaseDate', null);

                // DD/MM/YYYY (Frontend) to YYYY-MM-DD (BD, Backend)
                if (typeof value === 'string' && value.includes('/')) {
                    const [day, month, year] = value.split('/');
                    const isoDate = `${year}-${month}-${day}`;
                    this.setDataValue('releaseDate', isoDate);
                } else {
                    this.setDataValue('releaseDate', value);
                }
            }
        },
        category: {
            type: Sequelize.STRING
        },
        stock: {
            type: Sequelize.INTEGER
        }
    });
    return Game;
};