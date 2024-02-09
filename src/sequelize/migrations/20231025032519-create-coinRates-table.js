module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('coinRates', {
      id: {
        primaryKey: true,
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      rate: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false,
        defaultValue: 0,
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    }, {
      engine: 'InnoDB',
      charset: 'utf8',
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('coinRates');
  },
};
