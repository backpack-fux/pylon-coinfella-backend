module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('assetTransfers', 'fee', {
            type: Sequelize.DECIMAL(10, 5),
            allowNull: false,
            defaultValue: 0,
        }, { logging: console.log });
    },
    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('assetTransfers', 'fee');
    },
};
//# sourceMappingURL=20230602033649-add-fee-to-assetTransfers.js.map