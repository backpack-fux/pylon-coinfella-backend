module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('checkouts', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      checkoutTokenId: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      walletAddress: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      email: {
        allowNull: false,
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
      tip: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      tipType: {
        allowNull: false,
        defaultValue: 'percent',
        type: Sequelize.ENUM('cash', 'percent')
      },
      fee: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false,
        defaultValue: 0,
      },
      feeType: {
        allowNull: false,
        defaultValue: 'percent',
        type: Sequelize.ENUM('cash', 'percent')
      },
      streetAddress: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      streetAddress2: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING(255),
      },
      city: {
        allowNull: false,
        type: Sequelize.STRING(255),
      },
      state: {
        allowNull: false,
        type: Sequelize.STRING(25),
      },
      postalCode: {
        allowNull: false,
        type: Sequelize.STRING(10),
      },
      country: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.STRING(255),
      },
      status: {
        allowNull: false,
        defaultValue: 'pending',
        type: Sequelize.ENUM('pending', 'processing', 'paid', 'postponed', 'error')
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
    await queryInterface.dropTable('checkouts');
  },
};
