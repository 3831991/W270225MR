import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import moment from 'moment/moment.js';
import AuthRouter from './handlers/auth.js';
import ArticlesRouter from './handlers/articles.js';

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

app.use((req, res, next) => {
    // אם הניתוב פונה לחידוש טוקן, לא הוספנו לתוך התיעוד (כי יש יותר מדי פניות כאלו)
    if (req.url === '/token') {
        next();
        return;
    }

    // מביא לנו את פרטי היוזר שמחובר
    const data = jwt.decode(req.headers.authorization);

    // יצרנו שם דינאמי לקובץ הלוגים, ע"מ שכל יום יהיה קובץ אחר
    const fileName = `./logs/log_${moment().format("YYYY_MM_DD")}.txt`;
    let content = "";

    content += `Time: ${moment().format("DD/MM/YYYY HH:mm:ss")}\n`;
    content += `Method: ${req.method}\n`;
    content += `Route: ${req.url}\n`;

    // אם יש יוזר מחובר (כלומר, אם יש טוקן)
    if (data?.userId) {
        content += `UserID: ${data.userId}\n`;
        content += `UserName: ${data.fullName}\n`;
    }

    // הוספת שורות חדשות ועוד קישוטים
    content += '\n---\n\n';

    // אם לא קיימת תיקייה של לוגים - הוא מייצר אותה
    fs.mkdirSync('./logs', { recursive: true });

    // אם אין את הקובץ הוא מייצר אותו, אחרת - הוא מוסיף אליו את התוכן
    fs.appendFile(fileName, content, err => {});

    // עובר ל-MiddleWare הבא
    next();
});

// הפעלת השרת ושימוש בפורט
app.listen(3500, () => {
    console.log("listening on port 3500");
});

// יירוט בקשה ללא ניתוב (דף הבית)
app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});

app.use("/", AuthRouter);
app.use("/articles", ArticlesRouter);