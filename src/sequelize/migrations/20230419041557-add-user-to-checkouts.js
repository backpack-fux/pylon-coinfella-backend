module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkouts', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null
    }, { logging: console.log });

    await queryInterface.addConstraint('checkouts', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'checkout_account_id',
      references: {
        table: 'users',
        field: 'id',
      },
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkouts', 'userId');
  },
};
