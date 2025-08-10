import Joi from "Joi";

export const EmployeeStructure = [
    { field: 'firstName', type: 'text', label: 'שם פרטי', icon: 'user', joi: Joi.string().min(2).max(20).required() },
    { field: 'lastName', type: 'text', label: 'שם משפחה', icon: 'users', joi: Joi.string().min(2).max(20).required() },
    { field: 'personalId', type: 'number', label: 'תעודת זהות', icon: 'id-card', joi: Joi.string().length(9).required() },
    { field: 'phone', type: 'tel', label: 'טלפון', icon: 'phone', joi: Joi.string().pattern(/^\d{10}$/).required() },
    { field: 'email', type: 'email', label: 'אימייל', icon: 'envelope', joi: Joi.string().email().required() },
    { field: 'birthDate', type: 'date', label: 'תאריך לידה', icon: 'calendar', joi: Joi.date().iso().required() },
    { field: 'city', type: 'text', label: 'עיר', icon: 'city', joi: Joi.string().min(2).max(50).required() },
    { field: 'street', type: 'text', label: 'רחוב', icon: 'map-marker-alt', joi: Joi.string().min(2).max(100).required() },
    { field: 'house', type: 'text', label: 'מספר בית', icon: 'home', joi: Joi.string().min(1).max(10).required() },
    { field: 'gender', type: 'select', label: 'מין', icon: 'venus-mars', joi: Joi.string().valid('זכר', 'נקבה').required() },
];