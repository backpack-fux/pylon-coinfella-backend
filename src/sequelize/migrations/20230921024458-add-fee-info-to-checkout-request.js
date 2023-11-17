module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkoutRequests', 'fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 6.5,
    }, { logging: console.log });

    await queryInterface.addColumn('checkoutRequests', 'feeType', {
      allowNull: false,
      defaultValue: 'percent',
      type: Sequelize.ENUM('cash', 'percent')
    }, { logging: console.log });

    await queryInterface.addColumn('checkoutRequests', 'feeMethod', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    }, { logging: console.log });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkoutRequests', 'fee');
    await queryInterface.removeColumn('checkoutRequests', 'feeType');
    await queryInterface.removeColumn('checkoutRequests', 'feeMethod');
  },
};
