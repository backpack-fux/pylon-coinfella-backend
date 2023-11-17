module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checkoutRequests', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      partnerOrderId: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING(255),
      },
      walletAddress: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      email: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING(100),
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      currency: {
        type: Sequelize.STRING(3),
        allowNull: false,
        defaultValue: 'USD',
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      status: {
        allowNull: false,
        defaultValue: 'pending',
        type: Sequelize.ENUM('pending', 'processing', 'paid', 'postponed', 'error')
      },
      webhook: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT
      },
      createdAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        allowNull: false,
      },
      updatedAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        allowNull: false,
      },
    }, {
      engine: 'InnoDB',
      charset: 'utf8',
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('checkoutRequests');
  },
};
