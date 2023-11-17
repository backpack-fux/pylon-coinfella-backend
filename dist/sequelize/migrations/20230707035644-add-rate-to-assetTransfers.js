module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('assetTransfers', 'rate', {
            type: Sequelize.DECIMAL(10, 6),
            allowNull: false,
            defaultValue: 0,
        }, { logging: console.log });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('assetTransfers', 'rate');
    },
};
//# sourceMappingURL=20230707035644-add-rate-to-assetTransfers.js.map