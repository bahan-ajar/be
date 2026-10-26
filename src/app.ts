import express, { Application, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import apiRoutes from './routes/api';

const app: Application = express();

// Konfigurasi Middlewares Express
// Mengizinkan credentials agar cookie sesi dapat dikirim dari antarmuka Next.js
app.use(cors({
    origin: (origin, callback) => {
        // Mengizinkan localhost/dev origin dan request tanpa origin (seperti Postman/cURL)
        callback(null, true);
    },
    credentials: true,
}));

// Cookie Parser untuk membaca HttpOnly session cookies (Pertemuan 9 — Langkah 2)
app.use(cookieParser());

// Parser body JSON dan URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Menyambungkan rute dari api.ts
app.use('/api', apiRoutes);

// Endpoint info / health check
app.get('/', (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: 'Backend Express API berjalan!',
        version: '1.0.0',
    });
});

// Handling 404 Not Found
app.use((req: Request, res: Response) => {
    res.status(404).json({
        success: false,
        message: `Rute '${req.originalUrl}' tidak ditemukan.`,
    });
});

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    console.error('Unhandled Server Error:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Terjadi kesalahan internal pada server.',
    });
});

export default app;
