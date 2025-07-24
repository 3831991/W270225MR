import jwt from 'jsonwebtoken';
import { JWT_SECRET } from './config.js';

export default (req, res, next) => {
    const authorization = req.headers.authorization || req.query.authorization;
    jwt.verify(authorization, JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).send({ message: "User is not authorized" });
        } else {
            next();
        }
    });
}