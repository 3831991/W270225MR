import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

export const router = Router();

// שם הקובץ הנוכחי
const __filename = fileURLToPath(import.meta.url);
// שם התיקייה הנוכחית
const __dirname = path.dirname(__filename);

router.get('/', (req, res) => {
    // שליחת מערך עם שמות הקבצים שיש בתיקייה
    fs.readdir("./images", (err, files) => {
        res.send(files);
    });
});

router.get('/:fileName', (req, res) => {
    // ניתוב אבסולוטי לקובץ
    let url = `${__dirname}/../images/${req.params.fileName}`;
    // ניקוי הנתיב מניתובים
    url = path.resolve(url);
    // שליחת הקובץ ללקוח
    res.sendFile(url);
});

export default router;