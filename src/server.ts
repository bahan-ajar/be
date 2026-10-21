import dotenv from 'dotenv';

// Membaca environment variables dari file .env
dotenv.config();

import app from './app';
import pool from './config/db';

const PORT = process.env.PORT || 5000;

/**
 * Menguji koneksi database dan menjalankan server Express
 */
const startServer = async () => {
    try {
        // Uji koneksi connection pool ke database MySQL
        const connection = await pool.getConnection();
        console.log('✓ Berhasil terhubung ke database MySQL (Connection Pool siap)');
        connection.release();
    } catch (dbError) {
        console.error('✗ Peringatan: Gagal terhubung ke database MySQL:', dbError);
        console.log('ℹ Server tetap dijalankan. Pastikan MySQL sudah menyala dan kredensial .env sudah tepat.');
    }

    app.listen(PORT, () => {
        console.log(`🚀 Server berjalan pada: http://localhost:${PORT}`);
        console.log(`📡 API Login endpoint : http://localhost:${PORT}/api/login`);
    });
};

startServer();
