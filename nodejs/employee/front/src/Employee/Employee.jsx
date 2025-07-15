import { useEffect, useState } from 'react';
import { Link } from 'react-router';
import './Employee.css';

export default function Employee() {
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        getData();
    }, []);

    const getData = async () => {
        const res = await fetch("http://localhost:4000/employees");
        setEmployees(await res.json());
    }

    return (
        <>
            <h1>ניהול עובדים</h1>
            <div className='cards'>
                {
                    employees.map((e, i) => 
                        <Link key={e._id} to={`/employee/${e._id}`}>
                            <div className='Card'>
                                <div className='circle' style={{ backgroundColor: `hsl(${i * 40}deg 83% 47%)` }}>{e.firstName[0]}</div>
                                <h3>{e.firstName} {e.lastName}</h3>
                            </div>
                        </Link>
                    )
                }
            </div>
        </>
    )
}
