module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('charges', 'code', {
      type: Sequelize.STRING(50),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('charges', 'code');
  },
};
