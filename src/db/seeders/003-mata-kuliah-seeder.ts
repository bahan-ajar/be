import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('mata_kuliah', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.bulkInsert('mata_kuliah', [
            {
                id: 1,
                kode: 'MK-101',
                nama: 'Pemrograman Web Lanjut',
                dosen_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                kode: 'MK-102',
                nama: 'Basis Data Terdistribusi',
                dosen_id: 1,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                kode: 'MK-103',
                nama: 'Kecerdasan Buatan',
                dosen_id: 2,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('mata_kuliah', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};
