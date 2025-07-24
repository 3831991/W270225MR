import guard from '../guard.js';
import { model, Schema } from "mongoose";
import { Router } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';

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
    userCreatedId: Schema.Types.ObjectId,
});

export const Employee = model("employees", EmployeeSchema);

const router = Router();

// Get all employees
router.get('/', guard, async (req, res) => {
    const user = jwt.decode(req.headers.authorization);

    const data = await Employee.find({ userCreatedId: user.userId });
    res.send(data);
});

// Get employee
router.get('/:id', guard, async (req, res) => {
    try {
        const user = jwt.decode(req.headers.authorization);

        const data = await Employee.findOne({ _id: req.params.id, userCreatedId: user.userId });

        if (!data) {
            res.status(403).send({ message: 'לא נמצא עובד' });
        }

        res.send(data);
    } catch (err) {
        res.status(403).send({ message: 'לא נמצא עובד' });
    }
});

// Get image
router.get('/images/:imageId', guard, async (req, res) => {
    const user = jwt.decode(req.headers.authorization || req.query.authorization);

    const employee = await Employee.findOne({ 'image._id': req.params.imageId, userCreatedId: user.userId });
    res.download(`./images/${req.params.imageId}`, employee.image.name);
});

// Add employee
router.post('/', guard, async (req, res) => {
    const item = req.body;
    const user = jwt.decode(req.headers.authorization);

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
        userCreatedId: user.userId,
    });

    const newEmployee = await employee.save();

    if (item.image?.base64) {
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
    }

    res.send(newEmployee);
});

// Edit employee
router.put('/:id', guard, async (req, res) => {
    const item = req.body;

    try {
        const user = jwt.decode(req.headers.authorization);
        const employee = await Employee.findOne({ _id: req.params.id, userCreatedId: user.userId });
        
        if (!employee) {
            return res.status(403).send({ message: 'עובד לא קיים' });
        }

        employee.firstName = item.firstName;
        employee.lastName = item.lastName;
        employee.personalId = item.personalId;
        employee.phone = item.phone;
        employee.email = item.email;
        employee.birthDate = item.birthDate;
        employee.gender = item.gender;
        employee.address.city = item.city;
        employee.address.street = item.street;
        employee.address.house = item.house;

        if (item.image.base64) {
            employee.image = {
                name: item.image.name,
                size: item.image.size,
                type: item.image.type,
            };

            const savedItem = await employee.save();

            // אם אין את התיקייה - צור אותה
            if (!fs.existsSync('./images')) {
                fs.mkdirSync('./images', { recursive: true });
            }

            // מחלץ את הקוד שמייצג את התמונה
            const imageData = item.image.base64;
            const matches = imageData.match(/^data:(.+);base64,(.+)$/);
            const bas64 = matches[2];

            // יוצר את התמונה באמצעות הקוד (Base64)
            fs.writeFile(`./images/${savedItem.image._id}`, Buffer.from(bas64, 'base64'), err => {

            });
        }
        // נמחקה התמונה
        else {
            if (!item.image._id) {
                delete employee.image;
            }

            await employee.save();
        }

        res.end();
    } catch (err) {
        res.status(403).send({ message: 'עובד לא קיים' });
    }
});

// Remove employee
router.delete('/:id', guard, async (req, res) => {
    try {
        const user = jwt.decode(req.headers.authorization);
        const employee = await Employee.findOne({ _id: req.params.id, userCreatedId: user.userId });
        
        if (!employee) {
            return res.status(403).send({ message: 'עובד לא קיים' });
        }

        await Employee.findByIdAndDelete(req.params.id);
        res.end();
    } catch (err) {
        res.status(403).send({ message: '' });
    }
});

export default router;