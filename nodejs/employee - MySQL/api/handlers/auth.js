import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from "../config.js";
import guard from '../guard.js';
import { connection } from "../sqlConnection.js";

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    connection.query("SELECT * FROM `users` WHERE `email` = ?", [email], async (err, result) => {
        if (!result.length) {
            return res.status(403).send({ message: "email or password incorrect" });
        }

        const userFind = result.pop();

        const passwordMatch = await bcrypt.compare(password, userFind.password);

        if (!passwordMatch) {
            return res.status(403).send({ message: "email or password incorrect" });
        }

        const obj = {
            userId: userFind.id,
            fullName: `${userFind.firstName} ${userFind.lastName}`,
        };

        const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });

        res.send(token);
    });
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, phone, email, password } = req.body;

    connection.query("SELECT * FROM `users` WHERE `email` = ?", [email], async (err, result) => {
        if (result.length) {
            return res.status(403).send({ message: "email is used" });
        }

        const sqlQuery = "INSERT INTO `users`( `firstName`, `lastName`, `phone`, `email`, `password`) VALUES(?,?,?,?,?)";
        const values = [firstName, lastName, phone, email, await bcrypt.hash(password, 10)];

        connection.query(sqlQuery, values, async (err, result) => {
            res.end();
        });
    })
});

router.get('/token', guard, async (req, res) => {
    const data = jwt.decode(req.headers.authorization);
    const obj = {
        userId: data.userId,
        fullName: data.fullName,
    };
    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '15m' });

    res.send(token);
});

export default router;