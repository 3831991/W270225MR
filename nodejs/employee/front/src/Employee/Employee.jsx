import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import './Employee.css';
import { useRef } from 'react';

export default function Employee() {
    const [employeeClicked, setEmployeeClicked] = useState();
    const [employees, setEmployees] = useState([]);
    const [isMenu, setIsMenu] = useState(false);
    const menu = useRef();
    const navigate = useNavigate();

    useEffect(() => {
        getData();
        window.addEventListener("click", () => setIsMenu(false));

        return () => window.removeEventListener("click", () => {});
    }, []);

    const getData = async () => {
        const res = await fetch("http://localhost:4000/employees");
        setEmployees(await res.json());
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

        const res = await fetch(`http://localhost:4000/employees/${id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setEmployees(employees.filter(e => e._id != id));
        }
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
                        <div className={'Card' + (isMenu && employeeClicked._id == e._id ? ' active' : '')} onContextMenu={ev => rightClick(ev, e)} onDoubleClick={() => navigate(`/employee/${e._id}`)} key={e._id}>
                            <div className='circle' style={{ backgroundColor: `hsl(${i * 40}deg 83% 47%)` }}>
                                {e.firstName[0]}
                                {/* התמונה כרקע על אלמנט שמכסה את הכל */}
                                <div style={{ backgroundImage: `url('http://localhost:4000/employees/images/${e.image._id}')` }}></div>    
                            </div>
                            <h3>{e.firstName} {e.lastName}</h3>
                        </div>
                    )
                }
            </div>

            <div className="context-menu" ref={menu} style={{ display: isMenu ? 'block' : 'none' }}>
                <Link to={`/employee/${employeeClicked?._id}`} className="menu-item"><i className='fa fa-eye'></i> צפייה</Link>
                <Link to={`/employee/edit/${employeeClicked?._id}`} className="menu-item"><i className='fa fa-edit'></i> עריכה</Link>
                <hr className="menu-separator" />
                <a href="#" className="menu-item"><i className='fa fa-copy'></i> שכפול</a>
                <a href="#" className="menu-item" onClick={() => remove(employeeClicked?._id)}><i className='fa fa-trash'></i> מחיקה</a>
            </div>
        </>
    )
}
