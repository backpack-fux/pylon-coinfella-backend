'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('checkoutRequests', 'phoneNumber', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('checkoutRequests', 'phoneNumber', {
      type: Sequelize.STRING(100),
      allowNull: false,
    }, { logging: console.log });
  }
};
