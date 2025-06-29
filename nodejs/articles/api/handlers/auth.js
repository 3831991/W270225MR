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

router.post('/login', (req, res) => {

});

router.post('/signup', async (req, res) => {
    const { firstName, lastName, email, phone, password } = req.body;

    const userFind = await User.findOne({ email });

    if (userFind) {
        return res.status(403).send({ message: "Email is used" })
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