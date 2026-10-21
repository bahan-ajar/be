import { RowDataPacket } from 'mysql2';

export interface User {
    id: number;
    name: string;
    email: string;
    password?: string;
    created_at?: Date | string;
    updated_at?: Date | string;
}

export interface UserRow extends RowDataPacket, User {}

export interface JwtUserPayload {
    id: number;
    name: string;
    email: string;
}
