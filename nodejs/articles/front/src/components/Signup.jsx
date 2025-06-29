import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router";
import { MyContext } from "../App";
import Joi from "joi";
import { JOI_HEBREW } from "../joi-hebrew";

export default function Signup() {
    const navigate = useNavigate();
    const { snackbar, setIsLoader } = useContext(MyContext);
    const isFirstRender = useRef(true);
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(true);
    const [form, setForm] = useState({
        fullName: '',
        email: '',
        userName: '',
        password: '',
    });
    const schema = Joi.object({
        fullName: Joi.string().min(4).max(20).required(),
        email: Joi.string().email({ tlds: false }),
        userName: Joi.string().max(10).required(),
        password: Joi.string().pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/).required(),
    });

    const change = ev => {
        // const id = ev.target.id;
        // const value = ev.target.value;
        const { id, value } = ev.target;

        setForm({
            ...form,
            [id]: value,
        });
    }

    const send = async ev => {
        ev.preventDefault();

        if (isError) {
            return;
        }

        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/signup`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            snackbar("המשתמש נוצר בהצלחה");
            navigate('/');
        } else {
            const err = await res.text();
            snackbar(err);
        }

        setIsLoader(false);
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const options = {
            messages: {
                he: {
                    ...JOI_HEBREW,
                    'string.pattern.base': 'הסיסמה צריכה לכלול לפחות 8 תווים, אות גדולה, אות קטנה, מספר, ותו מיוחד.',
                },
            },
            errors: {
                language: 'he'
            }
        };
        const validation = schema.validate(form, options);
        const err = {};

        validation.error?.details.forEach(x => {
            err[x.context.key] = x.message;
        });

        setErrors(err);
        setIsError(Boolean(validation.error));
    }, [form]);

    return (
        <>
            <h1>יצירת משתמש</h1>

            <form onSubmit={send}>
                <label className={errors.fullName ? 'errorField' : ''}>
                    <i className="fa fa-user"></i> שם מלא:
                    <input type="text" id="fullName" value={form.fullName} onChange={change} />
                    {errors.fullName && <div className="error">{errors.fullName}</div>}
                </label>

                <label className={errors.email ? 'errorField' : ''}>
                    <i className="fa fa-envelope"></i> אימייל:
                    <input type="text" id="email" value={form.email} onChange={change} />
                    {errors.email && <div className="error">{errors.email}</div>}
                </label>

                <label className={errors.userName ? 'errorField' : ''}>
                    <i className="fa fa-address-card"></i> שם משתמש:
                    <input type="text" id="userName" value={form.userName} onChange={change} />
                    {errors.userName && <div className="error">{errors.userName}</div>}
                </label>

                <label className={errors.password ? 'errorField' : ''}>
                    <i className="fa fa-asterisk"></i> סיסמה:
                    <input type="password" id="password" value={form.password} onChange={change} />
                    {errors.password && <div className="error">{errors.password}</div>}
                </label>
                <button disabled={isError}>הרשם</button>
            </form>

            <Link to="/">להתחברות לחץ כאן</Link>
        </>
    )
}