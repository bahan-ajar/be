import sequelize from '../config/database';
import userSeeder from './001-user-seeder';
import mahasiswaSeeder from './002-mahasiswa-seeder';
import mataKuliahSeeder from './003-mata-kuliah-seeder';
import absensiSeeder from './004-absensi-seeder';

const runSeeders = async () => {
    try {
        const queryInterface = sequelize.getQueryInterface();

        console.log('Menjalankan seeders...');

        await userSeeder.up(queryInterface);
        console.log('✓ Seeder users berhasil dijalankan');

        await mahasiswaSeeder.up(queryInterface);
        console.log('✓ Seeder mahasiswa berhasil dijalankan');

        await mataKuliahSeeder.up(queryInterface);
        console.log('✓ Seeder mata_kuliah berhasil dijalankan');

        await absensiSeeder.up(queryInterface);
        console.log('✓ Seeder absensi berhasil dijalankan');

        console.log('Semua seeder selesai dengan sukses!');
        await sequelize.close();
    } catch (error) {
        console.error('Seeder gagal:', error);
        await sequelize.close();
        process.exit(1);
    }
};

runSeeders();
