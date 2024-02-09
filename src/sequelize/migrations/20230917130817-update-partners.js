module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('partners', 'firstName', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'lastName', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'email', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'phoneNumber', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });


    await queryInterface.changeColumn('partners', 'phoneNumber', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'dob', {
      type: Sequelize.STRING(20),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'ssn', {
      type: Sequelize.STRING(100),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'streetAddress', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'city', {
      type: Sequelize.STRING(255),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'state', {
      type: Sequelize.STRING(25),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });

    await queryInterface.changeColumn('partners', 'postalCode', {
      type: Sequelize.STRING(10),
      allowNull: true,
      defaultValue: null,
    }, { logging: console.log });
  },

  down: async (queryInterface, Sequelize) => {
  },
};
