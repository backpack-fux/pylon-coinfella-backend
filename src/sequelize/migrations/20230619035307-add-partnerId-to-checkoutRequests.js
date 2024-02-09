module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkoutRequests', 'partnerId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null
    }, { logging: console.log });

    await queryInterface.removeColumn('checkoutRequests', 'webhook');

    await queryInterface.addConstraint('checkoutRequests', {
      type: 'foreign key',
      fields: ['partnerId'],
      name: 'checkoutRequests_partnerId',
      references: {
        table: 'partners',
        field: 'id',
      },
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkoutRequests', 'partnerId');
    await queryInterface.addColumn('checkoutRequests', 'webhook', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null
    }, { logging: console.log });
  },
};
