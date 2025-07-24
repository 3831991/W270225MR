import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export default (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).send({ message: "User is not authorized" });
        } else {
            next();
        }
    });
}