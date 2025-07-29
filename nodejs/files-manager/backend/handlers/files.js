import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formidable } from 'formidable';
import { model, Schema } from 'mongoose';
import { mimeToExt } from '../config.js';

const schema = new Schema({
    createdTime: { type: Date, default: Date.now },
    fileName: String,
    isFolder: Boolean,
    size: Number,
    type: String,
    parent: Schema.Types.ObjectId,
});

const File = model("files", schema);

const router = Router();

// שם הקובץ הנוכחי
const __filename = fileURLToPath(import.meta.url);
// שם התיקייה הנוכחית
const __dirname = path.dirname(__filename);

// קבלת תוכן של תיקייה
router.get('/:folderId', async (req, res) => {
    const { folderId } = req.params;

    const files = await File.find({ parent: folderId == 'main' ? null : folderId });
    res.send(files);
});

// הצגת קובץ
router.get('/file/:fileId/:fileName', async (req, res) => {
    const { fileId } = req.params;
    const file = await File.findById(fileId);

    // ניתוב אבסולוטי לקובץ
    let url = `${__dirname}/../files/${file._id}`;
    // ניקוי הנתיב מניתובים
    url = path.resolve(url);

    res.setHeader("Content-Type", file.type);
    res.setHeader("Content-Disposition", `inline; filename="${encodeURIComponent(file.fileName + '.' + mimeToExt[file.type])}"`);

    // שליחת הקובץ ללקוח
    res.sendFile(url);
});

// Upload filed
router.post("/:folderId/upload", async (req, res) => {
    const { folderId } = req.params;
    const form = formidable();

    // אם אין את התיקייה - צור אותה
    if (!fs.existsSync('./files')) {
        fs.mkdirSync('./files', { recursive: true });
    }

    form.parse(req, async (err, fields, fileList) => {
        for (const f of fileList.files) {
            const name = f.originalFilename.split('.');
            name.pop();

            const file = new File({
                fileName: name.join('.'),
                isFolder: false,
                parent: folderId == 'main' ? null : folderId,
                size: f.size,
                type: f.mimetype,
            });

            const fileSaved = await file.save();

            fs.copyFile(f.filepath, `./files/${fileSaved._id}`, err => {
                if (err) {
                    console.log(err);
                }
            });
        }

        res.end();
    });
});

// Create folder
router.post("/folder/:folderId", async (req, res) => {
    const { folderId } = req.params;

    const form = formidable();

    form.parse(req, async (err, fields, files) => {
        const folder = new File({
            fileName: fields.folderName[0],
            isFolder: true,
            parent: folderId == 'main' ? null : folderId,
        });

        const newFolder = await folder.save();
        res.send(newFolder);
    });
});

router.patch('/:fileId/rename/:fileName', async (req, res) => {
    const { fileId, fileName } = req.params;
    await File.findByIdAndUpdate(fileId, { fileName });
    res.end();
});

router.delete('/:fileId', async (req, res) => {
    const { fileId } = req.params;
    await File.findByIdAndDelete(fileId);
    res.end();
});

export default router;