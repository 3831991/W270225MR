import { useContext, useEffect, useRef, useState } from "react"
import { MyContext } from "../App";
import Joi from 'joi';
import { JOI_HEBREW } from "../joi-hebrew";
import { Link } from "react-router";

export default function Login() {
    const [form, setForm] = useState({
        userName: '',
        password: '',
    });
    const isFirstRender = useRef(true);
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(true);
    const schema = Joi.object({
        userName: Joi.string().min(5).max(15).required(),
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

        const res = await fetch(`https://api.shipap.co.il/login`, {
            credentials: 'include',
            method: 'POST',
            headers: {'Content-type': 'application/json'},
            body: JSON.stringify(form),
        });

        if (res.ok) {
            const user = await res.json();
            snackbar(`${user.fullName} התחבר בהצלחה`);
            setUser(user);
        } else {
            const err = await res.text();
            snackbar(err);
        }

        setIsLoader(false);
    }

    return (
        <>
            <h1>התחברות</h1>

            <form>
                <label className={errors.userName ? 'errorField' : ''}>
                    שם משתמש:
                    <input type="text" value={form.userName} onChange={ev => setForm({ ...form, userName: ev.target.value })} />
                    {errors.userName && <div className="error">{errors.userName}</div>}
                </label>

                <label className={errors.password ? 'errorField' : ''}>
                    סיסמה:
                    <input type="password" value={form.password} onChange={ev => setForm({ ...form, password: ev.target.value })} />
                    {errors.password && <div className="error">{errors.password}</div>}
                </label>

                <button onClick={login} disabled={isError}>התחבר</button>
            </form>

            <Link to="/signup">להרשמה לחץ כאן</Link>
        </>
    )
}
