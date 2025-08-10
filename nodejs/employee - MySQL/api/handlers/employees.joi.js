import Joi from 'joi';
import { JOI_HEBREW } from '../joi-hebrew.js';

export const EmployeeJoiSchema = Joi.object({
    firstName: Joi.string().min(2).max(20).required(),
    lastName: Joi.string().min(2).max(20).required(),
    personalId: Joi.string().length(9).required(),
    phone: Joi.string().pattern(/^\d{10}$/).required(),
    email: Joi.string().email().required(),
    birthDate: Joi.date().iso().required(),
    city: Joi.string().min(2).max(50).required(),
    street: Joi.string().min(2).max(100).required(),
    house: Joi.string().min(1).max(10).required(),
    gender: Joi.string().valid('זכר', 'נקבה').required(),
}).unknown();

export const joiOptions = {
    abortEarly: false,
    messages: {
        he: JOI_HEBREW,
    },
    errors: {
        language: 'he'
    }
};

export default (req, res, next) => {
    const item = req.body;
    const { value, error } = EmployeeJoiSchema.validate(item, joiOptions);

    if (error) {
        const errors = error.details.reduce((obj, err) => {
            return {
                ...obj,
                [err.context.label]: err.message,
            };
        }, {});

        return res.send(errors);
    } else {
        next();
    }
}