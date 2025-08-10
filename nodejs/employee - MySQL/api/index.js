import express from 'express';
import cors from 'cors';
import EmployeesRouter from './handlers/employee.js';
import AuthRouter from './handlers/auth.js';
import './sqlConnection.js';

// שימוש ב-Express
const app = express();

// מגדיר שהנתונים שאנו קולטים בגוף הבקשה הם מסוג ג'סון
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// זה יוצר השהייה של דקה, ע"מ לתת חוויה של שרת אמיתי
app.use((req, res, next) => {
    setTimeout(next, 300);
});

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