module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('partners', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        defaultValue: null
      },
      companyName: {
        type: Sequelize.STRING(100),
        allowNull: false
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
      password: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT
      },
      phoneNumber: {
        allowNull: false,
        type: Sequelize.STRING(100),
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
      isApproved: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      webhook: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.TEXT,
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

    await queryInterface.addConstraint('partners', {
      type: 'foreign key',
      fields: ['userId'],
      name: 'partners_user_id',
      references: {
        table: 'users',
        field: 'id',
      },
    }, { logging: console.log });
  },
  // eslint-disable-next-line no-unused-vars
  down: async (queryInterface, DataTypes) => {
    await queryInterface.dropTable('partners');
  },
};
