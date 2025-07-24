import { useContext, useEffect, useRef, useState } from "react"
import { MyContext } from "../App";
import Joi from 'Joi';
import { JOI_HEBREW } from "../joi-hebrew";
import { Link } from "react-router";
import { jwtDecode } from "jwt-decode";
import './Login.css';

export default function Login() {
    const [form, setForm] = useState({
        email: '',
        password: '',
    });
    const isFirstRender = useRef(true);
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(true);
    const schema = Joi.object({
        email: Joi.string().min(5).max(15).required(),
        password: Joi.string().required(),
    });

    const { snackbar, setIsLoader, setUser } = useContext(MyContext);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        const options = { messages: { he: JOI_HEBREW }, errors: { language: 'he' } };
        const validation = schema.validate(form, options);
        const err = {};

        validation.error?.details.forEach(x => {
            err[x.context.key] = x.message;
        });

        setErrors(err);
        setIsError(Boolean(validation.error));
    }, [form]);

    const login = async ev => {
        ev.preventDefault();
        setIsLoader(true);

        const res = await fetch(`http://localhost:4000/login`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(form),
        });

        if (res.ok) {
            const token = await res.text();
            // פענוח ה-Token
            const user = jwtDecode(token);
            // שמירה מקומית
            localStorage.setItem("token", token);
            snackbar(`${user.fullName} התחבר בהצלחה`);
            setUser(user);
        } else {
            const err = await res.json();
            snackbar(err.message);
        }

        setIsLoader(false);
    }

    return (
        <div className="Login">
            <h1>התחברות</h1>

            <form>
                <label className={errors.email ? 'errorField' : ''}>
                    אימייל:
                    <input type="email" value={form.email} onChange={ev => setForm({ ...form, email: ev.target.value })} />
                    {errors.email && <div className="error">{errors.email}</div>}
                </label>

                <label className={errors.password ? 'errorField' : ''}>
                    סיסמה:
                    <input type="password" value={form.password} onChange={ev => setForm({ ...form, password: ev.target.value })} />
                    {errors.password && <div className="error">{errors.password}</div>}
                </label>

                <button onClick={login} disabled={isError}>התחבר</button>
            </form>

            <Link to="/signup">להרשמה לחץ כאן</Link>
        </div>
    )
}
