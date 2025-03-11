'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        for (let i = 0; i < 10; i++) {
            await
                queryInterface.bulkInsert('fotos', [{
                    titulo: 'fotos' + i,
                    descripcion: 'Lorem ipsum dolor sit amet, consectetur adipiscingelit.',
                    calificacion:
                        (Math.random() * 10).toFixed(2),
                    ruta:
                        'public/images/' + 'fotos' + i + '.png',
                    createdAt: new Date(),
                    updatedAt: new Date()
                }], {});
        }
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete('fotos', null, {});
    }
};
