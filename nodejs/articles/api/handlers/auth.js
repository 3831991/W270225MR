import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { Router } from 'express';

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

    res.send(userFind);
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

export default router;