import { useEffect, useState } from "react";

export default function Users() {
    const [users, setUsers] = useState([]);
    const [isModal, setIsModal] = useState(false);
    const [form, setForm] = useState();
    const [display, setDisplay] = useState('table');

    const getUsers = async () => {
        const res = await fetch("http://localhost:3000/users");

        if (res.ok) {
            const data = await res.json();
            data.reverse();
            setUsers(data);
        } else {
            console.log(res.status);
        }
    }

    useEffect(() => {
        getUsers();

        const escape = ev => {
            if (ev.key == 'Escape') {
                setIsModal(false);
            }
        }

        window.addEventListener("keyup", escape);

        return () => {
            window.removeEventListener("keyup", escape);
        }
    }, []);

    const addUser = async () => {
        const res = await fetch(`http://localhost:3000/users`, {
            method: 'POST',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });

        if (res.ok) {
            const item = await res.json();
            setUsers([item, ...users]);
            setIsModal(false);
        }
    }

    const saveUser = async () => {
        const res = await fetch(`http://localhost:3000/users/${form._id}`, {
            method: 'PUT',
            headers: { 'Content-type': 'application/json' },
            body: JSON.stringify(form),
        });
        
        if (res.ok) {
            const i = users.findIndex(x => x._id == form._id);
            users.splice(i, 1, form);
            setUsers([...users]);
            setIsModal(false);
        }
    }
    
    const save = ev => {
        ev.preventDefault();

        if (form._id) {
            saveUser();
        } else {
            addUser();
        }
    }

    const remove = async id => {
        if (!confirm("האם למחוק את היוזר?")) {
            return;
        }

        const res = await fetch(`http://localhost:3000/users/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setUsers(users.filter(x => x._id != id));
        }
    }

    const edit = async user => {
        setForm(user);
        setIsModal(true);
    }

    const chnage = ev => {
        const { id, value } = ev.target;

        setForm({
            ...form,
            [id]: value,
        });
    }

    const openModal = () => {
        setForm({
            firstName: '',
            lastName: '',
        });
        setIsModal(true);
    }

    return (
        <div>
            <br />
            {!isModal && <button className="add" onClick={openModal}>משתמש חדש</button>}

            <h1>משתמשים</h1>
            {
                isModal &&
                <div className="modal">
                    <button className="close" onClick={() => setIsModal(false)}>X</button>

                    <form onSubmit={save}>
                        <label>
                            שם פרטי
                            <input type="text" id="firstName" value={form.firstName} onChange={chnage} />
                        </label>
                        <label>
                            שם משפחה
                            <input type="text" id="lastName" value={form.lastName} onChange={chnage} />
                        </label>
                        <button>{form._id ? 'שמור' : 'הוסף'}</button>
                    </form>
                </div>
            }
            
            <nav>
                <button className={display == 'table' ? 'active' : ''} onClick={() => setDisplay('table')}>טבלה</button>
                <button className={display == 'cards' ? 'active' : ''} onClick={() => setDisplay('cards')}>כרטיסים</button>
            </nav>

            {display == 'table' && <UsersTable users={users} edit={edit} remove={remove} />}
            {display == 'cards' && <UsersCard users={users} edit={edit} remove={remove} />}
        </div>
    )
}

function UsersTable({ users, edit, remove }) {
    return (
        <table>
            <thead>
                <tr>
                    <th>#</th>
                    <th>שם פרטי</th>
                    <th>שם משפחה</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {
                    users.map((u, i) =>
                        <tr key={u._id}>
                            <td>{i + 1}</td>
                            <td>{u.firstName}</td>
                            <td>{u.lastName}</td>
                            <td>
                                <button onClick={() => edit(u)}>✏️</button>
                                <button onClick={() => remove(u._id)}>❌</button>
                            </td>
                        </tr>
                    )
                }
            </tbody>
        </table>
    )
}

function UsersCard({ users, edit, remove }) {
    return (
        <div className="UsersCard">
            {
                users.map((u, i) =>
                    <div className="Card" key={u._id}>
                        <h2>{u.firstName} {u.lastName}</h2>
                        <div className="actions">
                            <button onClick={() => edit(u)}>✏️</button>
                            <button onClick={() => remove(u._id)}>❌</button>
                        </div>
                    </div>
                )
            }
        </div>
    )
}