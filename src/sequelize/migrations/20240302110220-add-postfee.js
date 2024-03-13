"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Add postFee column to checkoutRequests table
    await queryInterface.addColumn("checkoutRequests", "postFee", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });

    // Add postFee column to checkouts table
    await queryInterface.addColumn("checkouts", "postFee", {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 0
    });
  },

  async down(queryInterface, Sequelize) {
    // Remove postFee column from checkoutRequests table
    await queryInterface.removeColumn('checkoutRequests', 'postFee');

    // Remove postFee column from checkouts table
    await queryInterface.removeColumn('checkouts', 'postFee');
  }
};
