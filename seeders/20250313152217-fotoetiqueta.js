'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up (queryInterface, Sequelize) {
        // Use the correct query format to get just the data
        const fotos = await queryInterface.sequelize.query(
            'SELECT id FROM fotos',
            { type: Sequelize.QueryTypes.SELECT }
        );

        const etiquetas = await queryInterface.sequelize.query(
            'SELECT id FROM etiquetas',
            { type: Sequelize.QueryTypes.SELECT }
        );

        // Now fotos and etiquetas are arrays of objects with id properties
        await queryInterface.bulkInsert('fotoetiquetas', [
            { foto_id: fotos[0].id, etiqueta_id: etiquetas[0].id, createdAt: new Date(), updatedAt: new Date() },
            { foto_id: fotos[0].id, etiqueta_id: etiquetas[1].id, createdAt: new Date(), updatedAt: new Date() },
            { foto_id: fotos[1].id, etiqueta_id: etiquetas[1].id, createdAt: new Date(), updatedAt: new Date() }
        ], {});
    },

    async down (queryInterface, Sequelize) {
        await queryInterface.bulkDelete('fotoetiquetas', null, {});
    }
};