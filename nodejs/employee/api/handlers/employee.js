import { model, Schema } from "mongoose";
import { Router } from 'express';

const Address = new Schema({
    city: String,
    street: String,
    house: String,
});

const Image = new Schema({
    name: String,
    size: Number,
    type: String,
});

const EmployeeSchema = new Schema({
    firstName: String,
    lastName: String,
    personalId: String,
    phone: String,
    email: String,
    birthDate: Date,
    address: Address,
    image: Image,
    gender: String,
    userId: Schema.Types.ObjectId,
});

export const Employee = model("employees", EmployeeSchema);

const router = Router();

// Get all employees
router.get('/',  async (req, res) => {
    res.send({ banana: 'Yellow' });
});

export default router;