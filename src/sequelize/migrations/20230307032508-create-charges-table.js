module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('charges', {
      id: {
        type: Sequelize.STRING(255),
        primaryKey: true,
        allowNull: false,
      },
      checkoutId: {
        type: Sequelize.UUID,
        allowNull: false,
        index: true
      },
      status: {
        type: Sequelize.STRING(50),
        allowNull: false
      },
      amount: {
        type: Sequelize.DECIMAL(10, 2),
        allowNull: false
      },
      currency: {
        type: Sequelize.STRING(10),
        allowNull: false
      },
      approved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      flagged: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      processedOn: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      reference: {
        type: Sequelize.STRING(255),
        allowNull: true,
        defaultValue: null
      },
      last4: {
        type: Sequelize.STRING(4),
        allowNull: true,
        defaultValue: null
      },
      bin: {
        type: Sequelize.STRING(10),
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

    await queryInterface.addConstraint('charges', {
      type: 'foreign key',
      fields: ['checkoutId'],
      name: 'chargeCheckoutId',
      references: {
        table: 'checkouts',
        field: 'id',
      },
    });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('charges');
  },
};
