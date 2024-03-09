'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('checkoutRequests', 'firstName', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'email' });

    await queryInterface.addColumn('checkoutRequests', 'lastName', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'email' });

    await queryInterface.addColumn('checkoutRequests', 'streetAddress', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'currency' });

    await queryInterface.addColumn('checkoutRequests', 'streetAddress2', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'currency' });

    await queryInterface.addColumn('checkoutRequests', 'city', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'currency' });

    await queryInterface.addColumn('checkoutRequests', 'state', {
      type: Sequelize.STRING(25),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'currency' });

    await queryInterface.addColumn('checkoutRequests', 'postalCode', {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log, before: 'currency' });

    await queryInterface.addColumn('checkoutRequests', 'country', {
      type: Sequelize.STRING(255),
      allowNull: false,
      defaultValue: "USA",
    }, { logging: console.log, before: 'currency' });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('checkoutRequests', 'firstName');
    await queryInterface.removeColumn('checkoutRequests', 'lastName');
    await queryInterface.removeColumn('checkoutRequests', 'streetAddress');
    await queryInterface.removeColumn('checkoutRequests', 'streetAddress2');
    await queryInterface.removeColumn('checkoutRequests', 'city');
    await queryInterface.removeColumn('checkoutRequests', 'state');
    await queryInterface.removeColumn('checkoutRequests', 'postalCode');
    await queryInterface.removeColumn('checkoutRequests', 'country');
  }
};
