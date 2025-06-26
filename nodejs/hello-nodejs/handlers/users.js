import mongoose from "mongoose";
import { Router } from 'express';

const schema = new mongoose.Schema({
    firstName: String,
    lastName: String,
});

const User = mongoose.model("users", schema);

const router = Router();

// יירוט בקשה עם ניתוב /users
// קבלת כל היוזרים
router.get("/", async (req, res) => {
    const data = await User.find();
    res.send(data);
});

// יירוט בקשה עם ניתוב /users/:userId
// קבלת יוזר אחד לפי מזהה
router.get("/:userId", async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);

        if (!user) {
            return res.status(403).send({ message: "User not found" });
        }

        res.send(user);
    } catch (err) {
        return res.status(403).send({ message: "ID is not valid" });
    }
});

// הוספת יוזר
router.post("/", async (req, res) => {
    const user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    });

    const newUser = await user.save();
    res.send(newUser);
});

// עריכת יוזר
router.put("/:userId", async (req, res) => {
    const user = await User.findById(req.params.userId);

    if (!user) {
        return res.status(403).send({ message: "לא נמצא משתמש" });
    }

    user.firstName = req.body.firstName;
    user.lastName = req.body.lastName;

    await user.save();
    res.send(user);
});

// מחיקת יוזר
router.delete("/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.end();
});

export default router;