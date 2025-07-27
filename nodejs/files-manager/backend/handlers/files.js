import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { formidable } from 'formidable';

const router = Router();

// שם הקובץ הנוכחי
const __filename = fileURLToPath(import.meta.url);
// שם התיקייה הנוכחית
const __dirname = path.dirname(__filename);



export default router;