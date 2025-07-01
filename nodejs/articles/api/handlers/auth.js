import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';
import jwt from 'jsonwebtoken';
export const JWT_SECRET = "W270225MR_THIS_IS_MY_SECRET_5456f4s56d4f56ds4f56ds";
import guard from '../guard.js';

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    phone: String,
    password: String,
});

const User = mongoose.model("users", schema);

const router = Router();

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const userFind = await User.findOne({ email });

    if (!userFind) {
        return res.status(403).send({ message: "email or password incorrect" });
    }

    const passwordMatch = await bcrypt.compare(password, userFind.password);

    if (!passwordMatch) {
        return res.status(403).send({ message: "email or password incorrect" });
    }

    const obj = {
        userId: userFind._id,
        fullName: `${userFind.firstName} ${userFind.lastName}`,
    };

    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '20s' });

    res.send(token);
});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    const userFind = await User.findOne({ email });

    if (userFind) {
        return res.status(403).send({ message: "email is used" });
    }

    const user = new User({
        firstName,
        lastName,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
    });

    const newUser = await user.save();

    res.send(newUser);
});

router.get('/token', guard, async (req, res) => {
    const data = jwt.decode(req.headers.authorization);
    const obj = {
        userId: data.userId,
        fullName: data.fullName,
    };
    const token = jwt.sign(obj, JWT_SECRET, { expiresIn: '20s' });

    res.send(token);
});

export default router;