module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('kycLinks', 'associatedUserType', {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'user',
            after: 'userId'
        }, { logging: console.log });
        await queryInterface.addColumn('kycLinks', 'associatedObjectType', {
            type: Sequelize.STRING(50),
            allowNull: false,
            defaultValue: 'user',
            after: 'id'
        }, { logging: console.log });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('kycLinks', 'associatedUserType');
        await queryInterface.removeColumn('kycLinks', 'associatedObjectType');
    },
};
//# sourceMappingURL=20230917150441-add-associatedObjectType-to-userLinks.js.map