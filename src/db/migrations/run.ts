import sequelize from '../config/database';
import usersMigration from './001-create-users';
import mahasiswaMigration from './002-create-mahasiswa';
import mataKuliahMigration from './003-create-mata-kuliah';
import absensiMigration from './004-create-absensi';

const runMigrations = async () => {
    try {
        const queryInterface = sequelize.getQueryInterface();

        console.log('Menjalankan migrations...');

        await usersMigration.up(queryInterface);
        console.log('✓ Migration users berhasil dijalankan');

        await mahasiswaMigration.up(queryInterface);
        console.log('✓ Migration mahasiswa berhasil dijalankan');

        await mataKuliahMigration.up(queryInterface);
        console.log('✓ Migration mata_kuliah berhasil dijalankan');

        await absensiMigration.up(queryInterface);
        console.log('✓ Migration absensi berhasil dijalankan');

        console.log('Semua migration selesai dengan sukses!');
        await sequelize.close();
    } catch (error) {
        console.error('Migration gagal:', error);
        await sequelize.close();
        process.exit(1);
    }
};

runMigrations();