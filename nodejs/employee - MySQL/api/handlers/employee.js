import guard from '../guard.js';
import { Router } from 'express';
import fs from 'fs';
import jwt from 'jsonwebtoken';
import { fileURLToPath } from 'url';
import path from 'path';
import validate from './employees.joi.js';
import { connection } from '../sqlConnection.js';

const router = Router();

// שם הקובץ הנוכחי
const __filename = fileURLToPath(import.meta.url);
// שם התיקייה הנוכחית
const __dirname = path.dirname(__filename);

// Get all employees
router.get('/', guard, async (req, res) => {
    const user = jwt.decode(req.headers.authorization);

    connection.query("SELECT * FROM `employees` WHERE `userCreatedId` = ?", [user.userId], (err, result) => {
        if (err) {
            res.status(403).send({ message: 'לא נמצאו נתונים' });
        } else {
            res.send(result);
        }
    });
});

// Get employee
router.get('/:id', guard, async (req, res) => {
    const user = jwt.decode(req.headers.authorization);

    connection.query("SELECT * FROM `employees` WHERE `id` = ? AND `userCreatedId` = ?", [req.params.id, user.userId], (err, result) => {
        if (err) {
            res.status(403).send({ message: 'לא נמצא עובד' });
        } else {
            if (result.length) {
                const employee = result[0];
                employee.image = {
                    id: employee.id,
                    name: employee.imageName,
                    size: employee.imageSize,
                    type: employee.imageType,
                };

                res.send(employee);
            } else {
                res.status(403).send({ message: 'לא נמצא עובד' });
            }
        }
    });
});

// Get image
router.get('/images/:id', guard, async (req, res) => {
    const user = jwt.decode(req.headers.authorization || req.query.authorization);

    connection.query("SELECT * FROM `employees` WHERE `id` = ? AND `userCreatedId` = ?", [req.params.id, user.userId], (err, result) => {
        if (err) {
            res.status(403).send({ message: 'לא נמצא עובד' });
        } else {
            if (result.length) {
                const employee = result[0];

                // ניתוב אבסולוטי לקובץ
                let url = `${__dirname}/../images/${req.params.id}`;
                // ניקוי הנתיב מניתובים
                url = path.resolve(url);

                res.setHeader("Content-Type", employee.imageType);
                res.setHeader("Content-Disposition", `inline; filename="${employee.imageName}"`);

                // שליחת הקובץ ללקוח
                res.sendFile(url);
            } else {
                res.status(403).send({ message: 'לא נמצא עובד' });
            }
        }
    });
});

// Add employee
router.post('/', guard, validate, async (req, res) => {
    const item = req.body;
    const user = jwt.decode(req.headers.authorization);

    const sqlQuery = "INSERT INTO `employees`(`firstName`, `lastName`, `personalId`, `phone`, `email`, `birthDate`, `city`, `street`, `house`, `imageName`, `imageSize`, `imageType`, `gender`, `userCreatedId`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [item.firstName, item.lastName, item.personalId, item.phone, item.email, item.birthDate, item.city, item.street, item.house, item.image?.name || null, item.image?.size || null, item.image?.type || null, item.gender, user.userId];

    connection.query(sqlQuery, values, async (err, result) => {
        if (err) {
            throw err;
        }

        const newEmployeeId =  result.insertId;

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
            fs.writeFile(`./images/${newEmployeeId}`, Buffer.from(bas64, 'base64'), err => {
        
            });
        }

        res.send({
            id: newEmployeeId,
        });
    });
});

// Edit employee
router.put('/:id', guard, validate, async (req, res) => {
    const item = req.body;
    const user = jwt.decode(req.headers.authorization);

    connection.query("SELECT * FROM `employees` WHERE `id` = ? AND `userCreatedId` = ?", [req.params.id, user.userId], (err, result) => {
        if (err) {
            res.status(403).send({ message: 'לא נמצא עובד' });
        } else {

            if (result.length) {
                const employee = result[0];

                let imageName = employee.imageName;
                let imageSize = employee.imageSize;
                let imageType = employee.imageType;

                if (item.image.base64) {
                    imageName = item.image?.name || null;
                    imageSize = item.image?.size || null;
                    imageType = item.image?.type || null;

                    // אם אין את התיקייה - צור אותה
                    if (!fs.existsSync('./images')) {
                        fs.mkdirSync('./images', { recursive: true });
                    }

                    // מחלץ את הקוד שמייצג את התמונה
                    const imageData = item.image.base64;
                    const matches = imageData.match(/^data:(.+);base64,(.+)$/);
                    const bas64 = matches[2];

                    // יוצר את התמונה באמצעות הקוד (Base64)
                    fs.writeFile(`./images/${employee.id}`, Buffer.from(bas64, 'base64'), err => {

                    });
                }

                const sqlQuery = "UPDATE `employees` SET `firstName`=?,`lastName`=?,`personalId`=?,`phone`=?,`email`=?,`birthDate`=?,`city`=?,`street`=?,`house`=?,`imageName`=?,`imageSize`=?,`imageType`=?,`gender`=? WHERE `userCreatedId`=? AND `id` = ?";
                const values = [item.firstName, item.lastName, item.personalId, item.phone, item.email, item.birthDate, item.city, item.street, item.house, imageName, imageSize, imageType, item.gender, user.userId, employee.id];

                connection.query(sqlQuery, values, async (err, result) => {

                    if (err) {
                        throw err;
                    }
                    res.end();
                });
            } else {
                res.status(403).send({ message: 'לא נמצא עובד' });
            }
        }
    });
});

// Remove employee
router.delete('/:id', guard, async (req, res) => {
    const user = jwt.decode(req.headers.authorization);

    const sqlQuery = "DELETE FROM `employees` WHERE `userCreatedId`=? AND `id` = ?";
    const values = [user.userId, req.params.id];

    connection.query(sqlQuery, values, async (err, result) => {
        res.end();
    });
});

export default router;