import { useContext, useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import './Employee.css';
import { useRef } from 'react';
import { MyContext } from '../App';

export default function Employee() {
    const [employeeClicked, setEmployeeClicked] = useState();
    const [employees, setEmployees] = useState([]);
    const [isMenu, setIsMenu] = useState(false);
    const menu = useRef();
    const navigate = useNavigate();
    const { snackbar, setIsLoader } = useContext(MyContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        getData();
        window.addEventListener("click", () => setIsMenu(false));

        return () => window.removeEventListener("click", () => {});
    }, []);

    const getData = async () => {
        setIsLoader(true);

        const res = await fetch("http://localhost:4000/employees", {
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        });
        setEmployees(await res.json());

        setIsLoader(false);
    }

    const rightClick = (ev, employee) => {
        ev.preventDefault();
        setEmployeeClicked(employee);

        const bodyWidth = document.body.offsetWidth;
        let leftPosition = ev.pageX;

        if (ev.pageX + menu.current.offsetWidth > bodyWidth) {
            leftPosition -= menu.current.offsetWidth;
        }

        menu.current.style.top = ev.pageY + 'px';
        menu.current.style.left = leftPosition + 'px';
        setIsMenu(true);
    }

    const remove = async id => {
        if (!confirm("האם למחוק את העובד?")) {
            return;
        }

        setIsLoader(true);

        const res = await fetch(`http://localhost:4000/employees/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        });

        if (res.ok) {
            setEmployees(employees.filter(e => e.id != id));
            snackbar("העובד נמחק בהצלחה");
        }

        setIsLoader(false);
    }

    const duplicate = () => {
        sessionStorage.setItem('duplicate', JSON.stringify(employeeClicked));
        navigate('/employee/create');
    }

    return (
        <>
            <h1>ניהול עובדים</h1>
            <Link to="/employee/create">
                <button className='button'><i className='fa fa-plus'></i> עובד חדש</button>
            </Link>

            <div className='cards'>
                {
                    employees.map((e, i) => 
                        <div className={'Card' + (isMenu && employeeClicked.id == e.id ? ' active' : '')} onContextMenu={ev => rightClick(ev, e)} onDoubleClick={() => navigate(`/employee/${e.id}`)} key={e.id}>
                            <div className='circle' style={{ backgroundColor: `hsl(${i * 40}deg 83% 47%)` }}>
                                {e.firstName[0]}
                                {/* התמונה כרקע על אלמנט שמכסה את הכל */}
                                <div style={{ backgroundImage: `url('http://localhost:4000/employees/images/${e.id}?authorization=${token}')` }}></div>    
                            </div>
                            <h3>{e.firstName} {e.lastName}</h3>
                        </div>
                    )
                }
            </div>

            { !employees.length && <p className='noData'>אין עדיין עובדים..</p> }

            <div className="context-menu" ref={menu} style={{ display: isMenu ? 'block' : 'none' }}>
                <Link to={`/employee/${employeeClicked?.id}`} className="menu-item"><i className='fa fa-eye'></i> צפייה</Link>
                <Link to={`/employee/edit/${employeeClicked?.id}`} className="menu-item"><i className='fa fa-edit'></i> עריכה</Link>
                <hr className="menu-separator" />
                <a href="#" className="menu-item" onClick={duplicate}><i className='fa fa-copy'></i> שכפול</a>
                <a href="#" className="menu-item" onClick={() => remove(employeeClicked?.id)}><i className='fa fa-trash'></i> מחיקה</a>
            </div>
        </>
    )
}
