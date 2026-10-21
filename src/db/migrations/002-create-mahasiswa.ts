import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.dropTable('mahasiswa');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.createTable('mahasiswa', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },

            nim: {
                type: DataTypes.STRING(20),
                allowNull: false,
                unique: true,
            },

            nama: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },

            kelas: {
                type: DataTypes.STRING(50),
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM('aktif', 'cuti', 'lulus', 'non-aktif'),
                allowNull: false,
                defaultValue: 'aktif',
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
        await queryInterface.dropTable('mahasiswa');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};
