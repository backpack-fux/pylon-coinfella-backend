module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('partners', 'ssn', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.STRING(100),
    }, { logging: console.log });

    await queryInterface.addColumn('partners', 'dob', {
      allowNull: true,
      defaultValue: null,
      type: Sequelize.STRING(50),
    }, { logging: console.log });

    await queryInterface.addColumn('partners', 'status', {
      type: Sequelize.ENUM('pending', 'active', 'manual_review', 'rejected'),
      allowNull: false,
      defaultValue: 'pending'
    }, { logging: console.log });

    await queryInterface.removeColumn('partners', 'userId');
    await queryInterface.removeColumn('partners', 'isApproved');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('partners', 'ssn');
    await queryInterface.removeColumn('partners', 'dob');
    await queryInterface.removeColumn('partners', 'status');
    await queryInterface.addColumn('partners', 'userId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null
    }, { logging: console.log });
    await queryInterface.addColumn('partners', 'isApproved', {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }, { logging: console.log });
  },
};
