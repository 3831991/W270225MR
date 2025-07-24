import { useContext, useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router";
import { MyContext } from "../App";
import Joi from "Joi";
import { JOI_HEBREW } from "../joi-hebrew";
import { SignupSchema } from "./SignupSchema";

export default function Signup() {
    const navigate = useNavigate();
    const { snackbar, setIsLoader } = useContext(MyContext);
    const isFirstRender = useRef(true);
    const [errors, setErrors] = useState({});
    const [isError, setIsError] = useState(true);
    const [form, setForm] = useState();
    const schema = useRef(Joi.object({}));

    const change = ev => {
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

        const res = await fetch(`http://localhost:4000/signup`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            snackbar("המשתמש נוצר בהצלחה");
            navigate('/');
        } else {
            const err = await res.json();
            snackbar(err.message);
        }

        setIsLoader(false);
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            const obj = {};
            const joiObj = {};

            SignupSchema.forEach(s => {
                obj[s.field] = '';
                joiObj[s.field] = s.joi;

                setForm(obj);
                schema.current = Joi.object(joiObj);
            });

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
        const validation = schema.current.validate(form, options);
        const err = {};

        validation.error?.details.forEach(x => {
            err[x.context.key] = x.message;
        });

        setErrors(err);
        setIsError(Boolean(validation.error));
    }, [form]);

    return (
        <div className="Login">
            <h1>יצירת משתמש</h1>

            {
                form &&
                <form onSubmit={send}>
                    {
                        SignupSchema.map(s =>
                            <label key={s.field} className={errors[s.field] ? 'errorField' : ''}>
                                <i className={'fa fa-' + s.icon}></i> {s.label}:
                                <input type={s.type} id={s.field} value={form[s.field]} onChange={change} />
                                {errors[s.field] && <div className="error">{errors[s.field]}</div>}
                            </label>
                        )
                    }
                    <button disabled={isError}>הרשם</button>
                </form>
            }

            <Link to="/">להתחברות לחץ כאן</Link>
        </div>
    )
}