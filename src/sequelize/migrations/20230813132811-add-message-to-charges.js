module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('charges', 'message', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('charges', 'message');
  },
};
