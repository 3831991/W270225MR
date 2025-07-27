import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formidable } from 'formidable';
import { model, Schema } from 'mongoose';

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

router.get('/:folderId', async (req, res) => {
    const { folderId } = req.params;

    const files = await File.find({ parent: folderId == 'main' ? null : folderId });
    res.send(files);
});

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

export default router;