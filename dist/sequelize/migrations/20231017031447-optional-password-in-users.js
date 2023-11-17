module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.TEXT,
            allowNull: true,
            defaultValue: null,
        }, { logging: console.log });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.changeColumn('users', 'password', {
            type: Sequelize.TEXT,
            allowNull: false,
        }, { logging: console.log });
    },
};
//# sourceMappingURL=20231017031447-optional-password-in-users.js.map