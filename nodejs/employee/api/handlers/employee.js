import { model, Schema } from "mongoose";
import { Router } from 'express';
import fs from 'fs'

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
    try {
        const data = await Employee.findById(req.params.id);
        res.send(data);
    } catch (err) {
        res.status(403).send({ message: '' });
    }
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
            city: item.city,
            street: item.street,
            house: item.house,
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

    // אם אין את התיקייה - צור אותה
    if (!fs.existsSync('./images')) {
        fs.mkdirSync('./images', { recursive: true });
    }

    // מחלץ את הקוד שמייצג את התמונה
    const imageData = item.image.base64;
    const matches = imageData.match(/^data:(.+);base64,(.+)$/);
    const bas64 = matches[2];

    // יוצר את התמונה באמצעות הקוד (Base64)
    fs.writeFile(`./images/${newEmployee.image._id}`, Buffer.from(bas64, 'base64'), err => {

    });

    res.send(newEmployee);
});

// Get image
router.get('/images/:imageId', async (req, res) => {
    const employee = await Employee.findOne({ 'image._id': req.params.imageId });
    res.download(`./images/${req.params.imageId}`, employee.image.name);
});

export default router;