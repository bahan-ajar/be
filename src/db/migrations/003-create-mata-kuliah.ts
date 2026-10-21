import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.dropTable('mata_kuliah');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.createTable('mata_kuliah', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },

            kode: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },

            nama: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            dosen_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'users',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
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
        await queryInterface.dropTable('mata_kuliah');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};
