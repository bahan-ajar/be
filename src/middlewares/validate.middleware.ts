import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

/**
 * Langkah 6: Middleware Validation menggunakan Zod safeParse
 * Memastikan request yang tidak valid dihentikan sebelum mencapai proses bisnis (Controller).
 */
export const validateBody = (schema: ZodSchema) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            const fieldErrors = result.error.flatten().fieldErrors;
            res.status(400).json({
                success: false,
                message: 'Validasi data gagal. Silakan periksa kembali input Anda.',
                errors: fieldErrors,
            });
            return;
        }

        // Simpan data hasil parsing yang valid ke req.body
        req.body = result.data;
        next();
    };
};
