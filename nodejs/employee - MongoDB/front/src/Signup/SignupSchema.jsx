import Joi from "Joi";

export const SignupSchema = [
    { field: 'firstName', type: 'text', label: 'שם פרטי', icon: 'user', joi: Joi.string().min(4).max(20).required() },
    { field: 'lastName', type: 'text', label: 'שם משפחה', icon: 'users', joi: Joi.string().min(4).max(20).required() },
    { field: 'email', type: 'text', label: 'אימייל', icon: 'envelope', joi: Joi.string().email({ tlds: false }) },
    { field: 'phone', type: 'text', label: 'טלפון', icon: 'phone', joi: Joi.string().min(10).max(12).required() },
    { field: 'password', type: 'password', label: 'סיסמה', icon: 'asterisk', joi: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).required() },
];