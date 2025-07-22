import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useParams } from 'react-router';
import Joi from 'Joi';
import moment from 'moment';
import './EmployeeCreate.css'; // We'll create this CSS file for styling
import { JOI_HEBREW } from '../joi-hebrew';
import { MyContext } from '../App';

// Provided EmployeeStructure (assuming this is in a separate file like `EmployeeStructure.js`)
export const EmployeeStructure = [
    { field: 'firstName', type: 'text', label: 'שם פרטי', icon: 'user', joi: Joi.string().min(2).max(20).required() },
    { field: 'lastName', type: 'text', label: 'שם משפחה', icon: 'users', joi: Joi.string().min(2).max(20).required() },
    { field: 'personalId', type: 'text', label: 'תעודת זהות', icon: 'id-card', joi: Joi.string().length(9).pattern(/^\d{9}$/).required().messages({
        'string.length': 'מספר תעודת זהות חייב להיות 9 ספרות',
        'string.pattern': 'מספר תעודת זהות חייב להכיל ספרות בלבד'
    }) },
    { field: 'phone', type: 'tel', label: 'טלפון', icon: 'phone', joi: Joi.string().pattern(/^(?:(?:(\+?972|\(\+?972\)|\+?\(972\))(?:\s|\.|-)?([1-9]\d?))|(0[23489]{1})|(0[57]{1}[0-9]))(?:\s|\.|-)?([^0\D]{1}\d{2}(?:\s|\.|-)?\d{4})$/).required().messages({
        'string.pattern': 'מספר טלפון לא תקין (10 ספרות)'
    }) },
    { field: 'email', type: 'email', label: 'אימייל', icon: 'envelope', joi: Joi.string().email({ tlds: { allow: false } }).required().messages({
        'string.email': 'כתובת אימייל לא תקינה'
    }) },
    { field: 'birthDate', type: 'date', label: 'תאריך לידה', icon: 'calendar', joi: Joi.date().iso().max('now').required().messages({
        'date.iso': 'פורמט תאריך לא תקין',
        'date.max': 'תאריך לידה לא יכול להיות בעתיד',
    }) },
    { field: 'city', type: 'text', label: 'עיר', icon: 'building', joi: Joi.string().min(2).max(50).required() },
    { field: 'street', type: 'text', label: 'רחוב', icon: 'map-marker', joi: Joi.string().min(2).max(100).required() },
    { field: 'house', type: 'text', label: 'מספר בית', icon: 'home', joi: Joi.string().min(1).max(10).required() },
    { field: 'gender', type: 'select', label: 'מגדר', icon: 'venus-mars', joi: Joi.string().valid('זכר', 'נקבה').required().messages({
        'any.only': 'יש לבחור מגדר'
    }) },
    { field: 'image', type: 'file', label: 'תמונת פרופיל', icon: 'picture', joi: Joi.required() },
];

const options = {
    messages: {
        he: {
            ...JOI_HEBREW,
            'string.pattern.base': 'לא תקין'
        },
    },
    errors: {
        language: 'he'
    }
};

// Create a Joi schema from the EmployeeStructure
const schema = Joi.object(
    EmployeeStructure.reduce((acc, field) => {
        acc[field.field] = field.joi;
        return acc;
    }, {})
);

const EmployeeCreate = () => {
    // State to hold form data
    const [formData, setFormData] = useState({});
    // State to hold validation errors
    const [errors, setErrors] = useState({});
    // State to track if the form has been submitted
    const [isSubmitted, setIsSubmitted] = useState(false);
    const navigate = useNavigate();
    const [image, setImage] = useState({
        name: '',
        size: '',
        type: '',
        base64: '',
    });
    const { employeeId } = useParams();
    const { snackbar, setIsLoader } = useContext(MyContext);

    // Initialize formData with empty strings for all fields
    useEffect(() => {
        if (sessionStorage.getItem('duplicate')) {
            const item = JSON.parse(sessionStorage.getItem('duplicate'));

            setFormData({
                firstName: item.firstName,
                lastName: item.lastName,
                personalId: item.personalId,
                phone: item.phone,
                email: item.email,
                birthDate: moment(item.birthDate).format('YYYY-MM-DD'),
                city: item.address.city,
                street: item.address.street,
                house: item.address.house,
                gender: item.gender,
                image: '',
            });

            sessionStorage.removeItem('duplicate');
        } else {
            const initialData = EmployeeStructure.reduce((acc, field) => {
                acc[field.field] = '';
                return acc;
            }, {});
            setFormData(initialData);
        }
    }, []);

    useEffect(() => {
        getEmployee();
    }, [employeeId]);

    const getEmployee = async () => {
        setIsLoader(true);

        const res = await fetch(`http://localhost:4000/employees/${employeeId}`);

        if (res.ok) {
            const item = await res.json();
            
            setFormData({
                firstName: item.firstName,
                lastName: item.lastName,
                personalId: item.personalId,
                phone: item.phone,
                email: item.email,
                birthDate: moment(item.birthDate).format('YYYY-MM-DD'),
                city: item.address.city,
                street: item.address.street,
                house: item.address.house,
                gender: item.gender,
                image: '',
            });

            setImage(item.image);
        }

        setIsLoader(false);
    }

    // Handle input changes
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value,
        }));

        // Validate individual field on change if form has been submitted
        if (isSubmitted) {
            validateField(name, value);
        }

        if (e.target.files) {
            const file = e.target.files[0];

            if (['image/jpeg', 'image/png'].includes(file.type)) {
                const reader = new FileReader();
                setIsLoader(true);

                reader.onload = ev => {
                    setImage({
                        name: file.name,
                        size: file.size,
                        type: file.type,
                        base64: ev.target.result,
                    });

                    setIsLoader(false);
                }
    
                reader.readAsDataURL(file);
            } else {
                setImage();
            }
        }
    };

    // Validate a single field
    const validateField = (fieldName, value) => {
        const fieldSchema = EmployeeStructure.find((f) => f.field === fieldName)?.joi;
        if (!fieldSchema) return;

        const { error } = fieldSchema.validate(value, options);
        setErrors((prevErrors) => ({
            ...prevErrors,
            [fieldName]: error ? error.message : null,
        }));
    };

    // Validate all fields
    const validateForm = () => {
        const { error } = schema.validate(formData, { abortEarly: false, ...options });
        if (!error) {
            setErrors({});
            return true;
        }

        const newErrors = {};
        for (let item of error.details) {
            newErrors[item.path[0]] = item.message;
        }
        setErrors(newErrors);
        return false;
    };

    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitted(true); // Mark form as submitted
        setIsLoader(true);

        const isValid = validateForm();
        if (isValid) {
            const obj = {
                ...formData,
                image,
            };

            const res = await fetch("http://localhost:4000/employees" + (employeeId ? `/${employeeId}` : ''), {
                credentials: 'include',
                method: employeeId ? 'PUT' : 'POST',
                headers: { 'Content-type': 'application/json' },
                body: JSON.stringify(obj),
            });

            if (res.ok) {
                if (employeeId) {
                    navigate(`/employee/${employeeId}`);
                } else {
                    const item = await res.json();
                    navigate(`/employee/${item._id}`);
                }
            }
        } else {
            snackbar("יש להשלים את כל הנתונים");
        }

        setIsLoader(false);
    };

    return (
        <div className="employee-form-container">
            <h2>{employeeId ? 'עריכת' : 'הוספת'} עובד</h2>
            <form className="employee-form" onSubmit={handleSubmit} noValidate>
                {EmployeeStructure.map((field) => (
                    <div className="form-group" key={field.field}>
                        <label htmlFor={field.field}>
                            <i className={`fa fa-${field.icon}`}></i> {field.label}:
                        </label>
                        {field.type === 'select' ? (
                            <select
                                id={field.field}
                                name={field.field}
                                value={formData[field.field] || ''}
                                onChange={handleChange}
                                className={errors[field.field] ? 'input-error' : ''}
                            >
                                <option value="" disabled>בחר...</option>
                                <option value="זכר">זכר</option>
                                <option value="נקבה">נקבה</option>
                            </select>
                        ) : (
                            <input
                                type={field.type}
                                id={field.field}
                                name={field.field}
                                value={formData[field.field] || ''}
                                onChange={handleChange}
                                className={errors[field.field] ? 'input-error' : ''}
                                accept='image/jpeg, image/png'
                            />
                        )}
                        {errors[field.field] && (
                            <div className="error-message">{errors[field.field]}</div>
                        )}
                    </div>
                ))}

                {image?.base64 && <div style={{ textAlign: 'center' }}><img src={image.base64} width={300} /></div>}
                {image?._id && !image?.base64 && <div style={{ textAlign: 'center' }}><img src={`http://localhost:4000/employees/images/${image._id}`} width={300} /></div>}

                <button type="submit" className="submit-button">שלח</button>
            </form>
        </div>
    );
};

export default EmployeeCreate;