module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('kycLinks', 'link', 'kycLink');

    await queryInterface.addColumn('kycLinks', 'email', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
      after: 'userId'
    }, { logging: console.log });

    await queryInterface.addColumn('kycLinks', 'type', {
      type: Sequelize.ENUM('individual', 'business'),
      allowNull: false,
      defaultValue: 'individual',
      after: 'email'
    }, { logging: console.log });

    await queryInterface.addColumn('kycLinks', 'tosLink', {
      type: Sequelize.TEXT,
      allowNull: true,
      defaultValue: null,
      after: 'kycLink'
    }, { logging: console.log });

    await queryInterface.addColumn('kycLinks', 'kycStatus', {
      type: Sequelize.ENUM('pending', 'active', 'manual_review', 'rejected'),
      allowNull: false,
      defaultValue: 'pending',
      after: 'tosLink'
    }, { logging: console.log });

    await queryInterface.addColumn('kycLinks', 'tosStatus', {
      type: Sequelize.ENUM('pending', 'approved'),
      allowNull: false,
      defaultValue: 'pending',
      after: 'kycStatus'
    }, { logging: console.log });

    await queryInterface.addColumn('kycLinks', 'customerId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
      after: 'userId'
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('kycLinks', 'kycLink', 'link');
    await queryInterface.removeColumn('kycLinks', 'type');
    await queryInterface.removeColumn('kycLinks', 'email');
    await queryInterface.removeColumn('kycLinks', 'tosLink');
    await queryInterface.removeColumn('kycLinks', 'kycStatus');
    await queryInterface.removeColumn('kycLinks', 'tosStatus');
    await queryInterface.removeColumn('kycLinks', 'customerId');
  },
};
