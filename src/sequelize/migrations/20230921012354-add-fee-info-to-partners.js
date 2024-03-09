module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('partners', 'fee', {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
      defaultValue: 6.5,
    }, { logging: console.log });

    await queryInterface.addColumn('partners', 'feeType', {
      allowNull: false,
      defaultValue: 'percent',
      type: Sequelize.ENUM('cash', 'percent')
    }, { logging: console.log });

    await queryInterface.addColumn('partners', 'feeMethod', {
      type: Sequelize.INTEGER.UNSIGNED,
      allowNull: false,
      defaultValue: 1,
    }, { logging: console.log });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('partners', 'fee');
    await queryInterface.removeColumn('partners', 'feeType');
    await queryInterface.removeColumn('partners', 'feeMethod');
  },
};
