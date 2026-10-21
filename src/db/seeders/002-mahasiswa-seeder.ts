import { QueryInterface } from 'sequelize';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('mahasiswa', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        await queryInterface.bulkInsert('mahasiswa', [
            {
                id: 1,
                nim: '2101001',
                nama: 'Ahmad Fauzi',
                kelas: 'TI-3A',
                status: 'aktif',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                nim: '2101002',
                nama: 'Dewi Lestari',
                kelas: 'TI-3A',
                status: 'aktif',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                nim: '2101003',
                nama: 'Rian Pratama',
                kelas: 'TI-3B',
                status: 'aktif',
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 4,
                nim: '2101004',
                nama: 'Nadia Putri',
                kelas: 'TI-3B',
                status: 'cuti',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('mahasiswa', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};
