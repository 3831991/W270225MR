import express from 'express';
import cors from 'cors';
import FilesRouter from './handlers/files.js';
import mongoose from 'mongoose';

// חיבור למסד הנתונים
await mongoose.connect('mongodb://127.0.0.1:27017/full-stack-W270225MR');
console.log('mongodb connection');

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.listen(5000, () => {
    console.log("listening on port 5000");
});

app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});

app.use("/files", FilesRouter);