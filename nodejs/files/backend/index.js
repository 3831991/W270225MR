import express from 'express';
import cors from 'cors';
import FilesRouter from './handlers/files.js';

const app = express();

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,PATCH,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.use('/', express.static('public'));

app.listen(3333, () => {
    console.log("listening on port 3333");
});

app.get('/', (req, res) => {
    res.send({
        message: "Hello world!",
    });
});

app.use("/files", FilesRouter);