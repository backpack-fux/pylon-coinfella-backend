"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TYPE "enum_checkouts_status" ADD VALUE 'transferring';
  `);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.sequelize.query(`
    ALTER TYPE "enum_checkouts_status" DROP VALUE 'transferring';
  `);
  }
};
