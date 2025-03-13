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
        let etiquetas = ['foto', 'payaso', 'rojo', 'azul', 'techo', 'cielo',
            'foco', 'luz']
        for (let etiqueta of etiquetas) {
            await queryInterface.bulkInsert('etiquetas', [{
                texto: etiqueta,
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
        await queryInterface.bulkDelete('etiquetas', null, {});
    }
};
