import { QueryInterface } from 'sequelize';
import bcrypt from 'bcryptjs';

export default {
    async up(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('users', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');

        const defaultPassword = await bcrypt.hash('password123', 10);
        const adminPassword = await bcrypt.hash('adminpassword', 10);

        await queryInterface.bulkInsert('users', [
            {
                id: 1,
                name: 'Dr. Budi Santoso, M.Kom.',
                email: 'budi.santoso@univ.ac.id',
                password: defaultPassword,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 2,
                name: 'Siti Rahma, M.Cs.',
                email: 'siti.rahma@univ.ac.id',
                password: defaultPassword,
                created_at: new Date(),
                updated_at: new Date(),
            },
            {
                id: 3,
                name: 'Administrator',
                email: 'admin@univ.ac.id',
                password: adminPassword,
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    async down(queryInterface: QueryInterface) {
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0;');
        await queryInterface.bulkDelete('users', {}, {});
        await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1;');
    },
};

