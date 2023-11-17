module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('assetTransfers', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
        defaultValue: Sequelize.UUIDV4,
      },
      checkoutId: {
        type: Sequelize.UUID,
        allowNull: false,
        index: true
      },
      status: {
        type: Sequelize.ENUM('pending', 'processing', 'paid', 'error', 'postponed'),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 6),
        allowNull: false
      },
      transactionHash: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      cancelledAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      settledAt: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
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

    await queryInterface.addConstraint('assetTransfers', {
      type: 'foreign key',
      fields: ['checkoutId'],
      name: 'assetTransferCheckoutId',
      references: {
        table: 'checkouts',
        field: 'id',
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('assetTransfers');
  },
};
