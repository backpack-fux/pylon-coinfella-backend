'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.removeConstraint('kycLinks', 'kycLinks_user_id', { logging: console.log });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addConstraint('kycLinks', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'kycLinks_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
    }, { logging: console.log });
  }
};
