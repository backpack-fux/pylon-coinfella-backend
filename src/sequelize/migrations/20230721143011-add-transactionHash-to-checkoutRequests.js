module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('checkoutRequests', 'transactionHash', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('checkoutRequests', 'transactionHash');
  },
};
