module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.UUID,
        primaryKey: true,
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM('pending', 'active', 'manual_review', 'rejected'),
        allowNull: false,
        defaultValue: 'pending'
      },
      firstName: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      lastName: {
        allowNull: false,
        type: Sequelize.STRING(100),
      },
      dob: {
        type: Sequelize.STRING(50),
        allowNull: true,
        defaultValue: null
      },
      gender: {
        type: Sequelize.ENUM('male', 'female'),
        allowNull: false,
        defaultValue: 'male'
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
      ssn: {
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
      requirementsDue: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.JSON
      },
      futureRequirementsDue: {
        allowNull: true,
        defaultValue: null,
        type: Sequelize.JSON
      },
      signedAgreementId: {
        allowNull: false,
        type: Sequelize.STRING(36)
      },
      idempotenceId: {
        allowNull: false,
        type: Sequelize.STRING(36)
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
    await queryInterface.dropTable('users');
  },
};
