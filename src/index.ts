
import express, { Request, Response } from 'express';
import sequelize from './db/config/database';

const app = express();
const port = process.env.PORT || 5000;

app.get("/", (req, res) => {
    res.send("Selamat, BE berjalan!");
});

app.listen(port, () => {
    console.log(`Server Express berjalan di http://localhost:${port}`);
});

const testDatabase = async () => {
    try {
        await sequelize.authenticate();

        console.log('Database connected successfully');
    } catch (error) {
        console.error('Unable to connect to database:', error);
    }
};

testDatabase();