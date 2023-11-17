module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkouts', 'checkoutRequestId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null
    }, { logging: console.log });

    await queryInterface.addConstraint('checkouts', {
      type: 'foreign key',
      fields: ['checkoutRequestId'],
      name: 'checkout_checkoutRequest_id',
      references: {
        table: 'checkoutRequests',
        field: 'id',
      },
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkouts', 'checkoutRequestId');
  },
};
