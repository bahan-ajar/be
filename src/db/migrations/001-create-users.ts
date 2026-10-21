import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.dropTable('users');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.createTable('users', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },

            name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            email: {
                type: DataTypes.STRING(100),
                allowNull: false,
                unique: true,
            },

            password: {
                type: DataTypes.STRING(255),
                allowNull: false,
            },

            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },

            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        });
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.dropTable('users');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};