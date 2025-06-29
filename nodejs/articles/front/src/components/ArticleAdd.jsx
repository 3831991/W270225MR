import { useContext, useState } from "react";
import { Link, useNavigate, useParams } from "react-router";
import { MyContext } from "../App";
import { useEffect } from "react";

export default function ArticleAdd() {
    const [form, setForm] = useState({
        headline: '',
        description: '',
        content: '',
        imgUrl: '',
        publishDate: '',
    });

    const { snackbar, setIsLoader } = useContext(MyContext);
    const navigate = useNavigate();
    const { articleId } = useParams();

    const add = async () => {
        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles`, {
            credentials: 'include',
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            snackbar("הכתבה נוספה בהצלחה");
            navigate('/');
        }
    }

    const update = async () => {
        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles/${articleId}`, {
            credentials: 'include',
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            snackbar("הכתבה נשמרה בהצלחה");
            navigate('/');
        }
    }

    const save = ev => {
        ev.preventDefault();

        if (articleId) {
            update();
        } else {
            add();
        }
    }

    const change = ev => {
        const { id, value } = ev.target;

        setForm({
            ...form,
            [id]: value,
        });
    }

    const getArticle = async id => {
        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles/${id}`, {
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            setForm(data);
        }

        setIsLoader(false);
    }

    useEffect(() => {
        // בודק אם אנחנו במצב עריכה, פונה לשרת ע"מ לבקש את הנתונים
        if (articleId) {
            getArticle(articleId);
        }

        // גלילה למעלה
        window.scroll(0,0);
    }, [articleId]);

    return (
        <div className="Articles">
            <br />
            <Link to="/">
                <button className="add"><i className="fa fa-angle-right"></i> לניהול כתבות</button>
            </Link>

            {articleId ? <h1>עריכת כתבה</h1> : <h1>כתבה חדשה</h1>}

            <form onSubmit={save}>
                <label>
                    כותרת:
                    <input type="text" id="headline" value={form.headline} onChange={change} />
                </label>

                <label>
                    תיאור:
                    <textarea id="description" value={form.description} onChange={change} cols="30" rows="5"></textarea>
                </label>

                <label>
                    תוכן:
                    <textarea id="content" value={form.content} onChange={change} cols="30" rows="10"></textarea>
                </label>

                <label>
                    תאריך פרסום:
                    <input type="date" id="publishDate" value={form.publishDate} onChange={change} />
                </label>

                <label>
                    קישור לתמונה:
                    <input type="text" id="imgUrl" value={form.imgUrl} onChange={change} />
                </label>

                <button>שמור <i className="fa fa-save"></i></button>
            </form>
        </div>
    )
}
