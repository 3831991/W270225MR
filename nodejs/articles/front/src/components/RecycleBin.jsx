import { useContext, useEffect, useState } from "react";
import moment from 'moment';
import { Link } from "react-router";
import { MyContext } from "../App";

export default function RecycleBin() {
    const [articles, setArticles] = useState([]);
    const { snackbar, setIsLoader, setUser } = useContext(MyContext);

    const getData = async () => {
        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles/recycle-bin`, {
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

    const restore = async id => {
        if (!confirm("האם לשחזר את הכתבה?")) {
            return;
        }

        setIsLoader(true);

        const res = await fetch(`https://api.shipap.co.il/articles/restore/${id}`, {
            credentials: 'include',
            method: 'PUT',
        });

        if (res.ok) {
            snackbar("הכתבה שוחזרה בהצלחה");
            setArticles(articles.filter(x => x.id != id));
        }

        setIsLoader(false);
    }

    return (
        <div className="Articles">
            <h1>סל מחזור</h1>

            <Link to="/">
                <button className="add"><i className="fa fa-angle-right"></i> לניהול כתבות</button>
            </Link>

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
                            <tr key={art.id}>
                                <td>{i + 1}</td>
                                <td>{art.headline}</td>
                                <td>{moment(art.addedTime).format("DD/MM/YY")}</td>
                                <td>{moment(art.publishDate).format("DD/MM/YY")}</td>
                                <td>{art.views}</td>
                                <td>
                                    <button className="green" onClick={() => restore(art.id)}><i className="fa fa-recycle"></i></button>
                                </td>
                            </tr>
                        )
                    }
                </tbody>
            </table>
        </div>
    )
}
