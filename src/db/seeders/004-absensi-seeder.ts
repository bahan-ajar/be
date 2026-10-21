import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('absensi', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.bulkInsert('absensi', [
            {
                id: 1,
                mahasiswa_id: 1,
                mata_kuliah_id: 1,
                tanggal: '2026-10-15',
                waktu: '08:00:00',
                status: 'hadir',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                mahasiswa_id: 2,
                mata_kuliah_id: 1,
                tanggal: '2026-10-15',
                waktu: '08:05:00',
                status: 'hadir',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                mahasiswa_id: 3,
                mata_kuliah_id: 1,
                tanggal: '2026-10-15',
                waktu: '08:15:00',
                status: 'izin',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                mahasiswa_id: 4,
                mata_kuliah_id: 1,
                tanggal: '2026-10-15',
                waktu: '08:00:00',
                status: 'alfa',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 5,
                mahasiswa_id: 1,
                mata_kuliah_id: 2,
                tanggal: '2026-10-15',
                waktu: '10:00:00',
                status: 'hadir',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 6,
                mahasiswa_id: 2,
                mata_kuliah_id: 2,
                tanggal: '2026-10-15',
                waktu: '10:02:00',
                status: 'sakit',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('absensi', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};
