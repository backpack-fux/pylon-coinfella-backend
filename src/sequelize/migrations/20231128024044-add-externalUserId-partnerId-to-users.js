module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('users', 'externalUserId', {
      type: Sequelize.STRING(1000),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.addColumn('users', 'partnerId', {
      type: Sequelize.UUID,
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.addConstraint('users', {
      type: 'foreign key',
      fields: ['partnerId'],
      name: 'users_partnerId',
      references: {
        table: 'partners',
        field: 'id',
      },
    }, { logging: console.log });

  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('partners', 'externalUserId');
    await queryInterface.removeColumn('partners', 'partnerId');
  },
};
