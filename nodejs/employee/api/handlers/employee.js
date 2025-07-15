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
    // userId: Schema.Types.ObjectId,
});

export const Employee = model("employees", EmployeeSchema);

const router = Router();

// Get all employees
router.get('/',  async (req, res) => {
    const data = await Employee.find();
    res.send(data);
});

// Get employee
router.get('/:id',  async (req, res) => {
    const data = await Employee.findById(req.params.id);
    res.send(data);
});

// Add employee
router.post('/', async (req, res) => {
    const item = req.body;

    const employee = new Employee({
        firstName: item.firstName,
        lastName: item.lastName,
        personalId: item.personalId,
        phone: item.phone,
        email: item.email,
        birthDate: item.birthDate,
        address: {
            city: item.address.city,
            street: item.address.street,
            house: item.address.house,
        },
        image: {
            name: item.image.name,
            size: item.image.size,
            type: item.image.type,
        },
        gender: item.gender,
        // userId: item.userId,
    });

    const newEmployee = await employee.save();
    res.send(newEmployee);
});

export default router;