import { QueryInterface, DataTypes } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.dropTable('absensi');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.createTable('absensi', {
            id: {
                type: DataTypes.BIGINT,
                autoIncrement: true,
                primaryKey: true,
            },

            mahasiswa_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'mahasiswa',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            mata_kuliah_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                references: {
                    model: 'mata_kuliah',
                    key: 'id',
                },
                onUpdate: 'CASCADE',
                onDelete: 'CASCADE',
            },

            tanggal: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },

            waktu: {
                type: DataTypes.TIME,
                allowNull: false,
            },

            status: {
                type: DataTypes.ENUM('hadir', 'izin', 'sakit', 'alfa'),
                allowNull: false,
                defaultValue: 'hadir',
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
        await queryInterface.dropTable('absensi');
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};
