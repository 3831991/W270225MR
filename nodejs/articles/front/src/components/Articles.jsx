import { useContext, useEffect, useState } from "react";
import moment from 'moment';
import { Link, useNavigate } from "react-router";
import { MyContext } from "../App";

export default function Articles() {
    const [articles, setArticles] = useState([]);
    const navigate = useNavigate();
    const { snackbar, setIsLoader, setUser } = useContext(MyContext);

    const getData = async () => {
        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles`, {
            credentials: 'include',
        });

        if (res.ok) {
            const data = await res.json();
            setArticles(data);
        }

        setIsLoader(false);
    }

    useEffect(() => {
        getData();
    }, []);

    const remove = async id => {
        if (!confirm("האם למחוק את הכתבה?")) {
            return;
        }

        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles/${id}`, {
            credentials: 'include',
            method: 'DELETE',
        });

        if (res.ok) {
            snackbar("הכתבה נמחקה בהצלחה");
            setArticles(articles.filter(x => x.id != id));
        }

        setIsLoader(false);
    }

    const goToEdit = async id => {
        navigate(`/article/${id}`);
    }

    return (
        <div className="Articles">
            <h1>ניהול כתבות</h1>

            <div className="actions">
                <Link to="/add">
                    <button className="add"><i className="fa fa-plus"></i> כתבה חדשה</button>
                </Link>

                <Link to="/recycle-bin">
                    <button className="add"><i className="fa fa-recycle"></i> סל מחזור</button>
                </Link>
            </div>

            {
                articles.length ?
                <table>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>כותרת</th>
                            <th>תאריך יצירה</th>
                            <th>תאריך פרסום</th>
                            <th>צפיות</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            articles.map((art, i) =>
                                <tr key={art.id} onDoubleClick={() => goToEdit(art.id)}>
                                    <td>{i + 1}</td>
                                    <td>{art.headline}</td>
                                    <td>{moment(art.addedTime).format("DD/MM/YY")}</td>
                                    <td>{moment(art.publishDate).format("DD/MM/YY")}</td>
                                    <td>{art.views}</td>
                                    <td>
                                        <button className="green" onClick={() => goToEdit(art.id)}><i className="fa fa-edit"></i></button>
                                        <button className="red" onClick={() => remove(art.id)}><i className="fa fa-trash"></i></button>
                                    </td>
                                </tr>
                            )
                        }
                    </tbody>
                </table> :
                <p className="noData">אין עדיין כתבות...</p>
            }
        </div>
    )
}
