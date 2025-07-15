import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import EmployeesRouter from './handlers/employee.js';
import AuthRouter from './handlers/auth.js';

// חיבור למסד הנתונים
await mongoose.connect('mongodb://127.0.0.1:27017/full-stack-W270225MR');
console.log('mongodb connection');

// שימוש ב-Express
const app = express();

// מגדיר שהנתונים שאנו קולטים בגוף הבקשה הם מסוג ג'סון
app.use(express.json());

// הגדרות Cors
// לאיזה דומיינים מאשר, מתודות ועוד
app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

// הפעלת השרת ושימוש בפורט
app.listen(4000, () => {
    console.log("listening on port 4000");
});

// יירוט בקשה ללא ניתוב (דף הבית)
app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});

app.use("/", AuthRouter);
app.use("/employees", EmployeesRouter);