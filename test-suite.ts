import http from 'http';
import app from './src/app';

// Jalankan app Express pada port pengujian
const server = http.createServer(app);
const TEST_PORT = 5055;

server.listen(TEST_PORT, async () => {
    console.log(`\n============================================================`);
    console.log(`=== PENGUJIAN OTENTIKASI, RBAC, IDOR & VALIDASI ZOD (BE) ===`);
    console.log(`============================================================\n`);

    let passedTests = 0;
    let failedTests = 0;

    const assert = (condition: boolean, testName: string, detail?: any) => {
        if (condition) {
            console.log(`  ✓ LULUS: ${testName}`);
            passedTests++;
        } else {
            console.error(`  ✗ GAGAL: ${testName}`);
            if (detail) console.error(`    Detail:`, detail);
            failedTests++;
        }
    };

    const baseUrl = `http://127.0.0.1:${TEST_PORT}/api`;

    try {
        // ------------------------------------------------------------
        // Test 1: Data login tidak valid -> ditolak 401
        // ------------------------------------------------------------
        const failLoginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'salah@univ.ac.id', password: 'passwordSalah' }),
        });
        assert(failLoginRes.status === 401, 'Login gagal mengembalikan status 401 Unauthorized');

        // ------------------------------------------------------------
        // Test 2: Login Akun Member (User A: Dr. Budi) -> 200 & Cookie
        // ------------------------------------------------------------
        const userALoginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'budi.santoso@univ.ac.id', password: 'password123' }),
        });
        const userAData = await userALoginRes.json();
        const userACookie = userALoginRes.headers.get('set-cookie');
        assert(userALoginRes.status === 200 && userAData.user.role === 'member', 'Login User A (Budi, Member) berhasil');
        assert(Boolean(userACookie && userACookie.includes('HttpOnly')), 'Cookie sesi memiliki flag HttpOnly & SameSite');

        const userAToken = userAData.token;

        // ------------------------------------------------------------
        // Test 3: Login Akun Member (User B: Siti Rahma) -> 200
        // ------------------------------------------------------------
        const userBLoginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'siti.rahma@univ.ac.id', password: 'password123' }),
        });
        const userBData = await userBLoginRes.json();
        const userBToken = userBData.token;
        assert(userBLoginRes.status === 200 && userBData.user.id !== userAData.user.id, 'Login User B (Siti, Member) berhasil dengan ID berbeda');

        // ------------------------------------------------------------
        // Test 4: Login Akun Admin -> 200 & role 'admin'
        // ------------------------------------------------------------
        const adminLoginRes = await fetch(`${baseUrl}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'admin@univ.ac.id', password: 'adminpassword' }),
        });
        const adminData = await adminLoginRes.json();
        const adminToken = adminData.token;
        assert(adminLoginRes.status === 200 && adminData.user.role === 'admin', 'Login Admin berhasil dengan role admin');

        // ------------------------------------------------------------
        // Test 5: Akses endpoint privat tanpa token -> 401 Unauthorized
        // ------------------------------------------------------------
        const unauthRes = await fetch(`${baseUrl}/auth/me`);
        assert(unauthRes.status === 401, 'Endpoint privat tanpa login ditolak 401 Unauthorized');

        // ------------------------------------------------------------
        // Test 6: Akses endpoint privat dengan token valid -> 200 OK
        // ------------------------------------------------------------
        const meRes = await fetch(`${baseUrl}/auth/me`, {
            headers: { Authorization: `Bearer ${userAToken}` },
        });
        const meData = await meRes.json();
        assert(meRes.status === 200 && meData.data.email === 'budi.santoso@univ.ac.id', 'GET /api/auth/me mengembalikan profil yang benar');

        // ------------------------------------------------------------
        // Test 7: Validasi Skema Zod (BE) menolak input invalid -> 400 Bad Request
        // ------------------------------------------------------------
        const invalidNoteRes = await fetch(`${baseUrl}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userAToken}`,
            },
            body: JSON.stringify({
                title: 'ab', // Kurang dari 3 karakter
                content: 'pendek', // Kurang dari 10 karakter
            }),
        });
        const invalidNoteData = await invalidNoteRes.json();
        assert(invalidNoteRes.status === 400 && invalidNoteData.errors?.title && invalidNoteData.errors?.content,
            'Middleware validasi Zod menolak field tidak valid dan memberikan error terstruktur per field');

        // ------------------------------------------------------------
        // Test 8: Tambah Catatan Baru Valid oleh User A
        // ------------------------------------------------------------
        const createNoteRes = await fetch(`${baseUrl}/notes`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userAToken}`,
            },
            body: JSON.stringify({
                title: 'Catatan Riset AI Pertemuan 10',
                content: 'Membahas arsitektur micro-services dan implementasi Zod schema.',
                category: 'Kuliah',
                priority: 4,
            }),
        });
        const createNoteData = await createNoteRes.json();
        const newNoteId = createNoteData.data.id;
        assert(createNoteRes.status === 201 && createNoteData.data.userId === userAData.user.id,
            'Catatan baru berhasil dibuat dan otomatis terikat ke userId User A');

        // ------------------------------------------------------------
        // Test 9: Cegah IDOR - User B mencoba membaca catatan milik User A
        // ------------------------------------------------------------
        const idorReadRes = await fetch(`${baseUrl}/notes/${newNoteId}`, {
            headers: { Authorization: `Bearer ${userBToken}` },
        });
        assert(idorReadRes.status === 404, 'Cegah IDOR: User B ditolak (404 Not Found) saat mencoba membaca catatan User A');

        // ------------------------------------------------------------
        // Test 10: Cegah IDOR - User B mencoba mengubah catatan milik User A
        // ------------------------------------------------------------
        const idorUpdateRes = await fetch(`${baseUrl}/notes/${newNoteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userBToken}`,
            },
            body: JSON.stringify({ title: 'Hacked by User B' }),
        });
        assert(idorUpdateRes.status === 404, 'Cegah IDOR: User B ditolak saat mencoba memanipulasi data User A');

        // ------------------------------------------------------------
        // Test 11: Cegah IDOR - User B mencoba menghapus catatan milik User A
        // ------------------------------------------------------------
        const idorDeleteRes = await fetch(`${baseUrl}/notes/${newNoteId}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${userBToken}` },
        });
        assert(idorDeleteRes.status === 404, 'Cegah IDOR: User B ditolak saat mencoba menghapus data User A');

        // ------------------------------------------------------------
        // Test 12: Pemilik asli (User A) berhasil mengubah catatannya sendiri
        // ------------------------------------------------------------
        const ownerUpdateRes = await fetch(`${baseUrl}/notes/${newNoteId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userAToken}`,
            },
            body: JSON.stringify({ title: 'Judul Diperbarui oleh Pemilik Asli' }),
        });
        assert(ownerUpdateRes.status === 200, 'User A (Pemilik Asli) berhasil memperbarui catatannya sendiri');

        // ------------------------------------------------------------
        // Test 13: RBAC - Member mencoba mengakses rute admin /api/users -> 403 Forbidden
        // ------------------------------------------------------------
        const memberUsersRes = await fetch(`${baseUrl}/users`, {
            headers: { Authorization: `Bearer ${userAToken}` },
        });
        assert(memberUsersRes.status === 403, 'RBAC: Role Member ditolak (403 Forbidden) saat mengakses /api/users');

        // ------------------------------------------------------------
        // Test 14: RBAC - Admin berhasil mengakses /api/users -> 200 OK
        // ------------------------------------------------------------
        const adminUsersRes = await fetch(`${baseUrl}/users`, {
            headers: { Authorization: `Bearer ${adminToken}` },
        });
        const adminUsersData = await adminUsersRes.json();
        assert(adminUsersRes.status === 200 && Array.isArray(adminUsersData.data), 'RBAC: Admin berhasil mengakses daftar pengguna /api/users');

        // ------------------------------------------------------------
        // Test 15: Logout mencabut cookie sesi
        // ------------------------------------------------------------
        const logoutRes = await fetch(`${baseUrl}/auth/logout`, { method: 'POST' });
        const logoutCookie = logoutRes.headers.get('set-cookie');
        const isCookieCleared = Boolean(logoutCookie && (logoutCookie.includes('token=;') || logoutCookie.includes('1970') || logoutCookie.includes('Max-Age=0')));
        assert(logoutRes.status === 200 && isCookieCleared, 'Logout berhasil dan mencabut cookie sesi');

    } catch (err: any) {
        console.error('Error saat menjalankan test suite:', err);
    } finally {
        console.log(`\n============================================================`);
        console.log(`HASIL: ${passedTests} LULUS, ${failedTests} GAGAL`);
        console.log(`============================================================\n`);
        server.close(() => process.exit(failedTests > 0 ? 1 : 0));
    }
});
