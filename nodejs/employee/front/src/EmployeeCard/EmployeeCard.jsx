import { useParams } from 'react-router';
import './EmployeeCard.css';
import { useEffect, useState } from 'react';

export default function EmployeeCard() {
    const [employee, setEmployee] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        getEmployee();
    }, [id]);

    const getEmployee = async () => {
        const res = await fetch(`http://localhost:4000/employees/${id}`);
        setEmployee(await res.json());
    }

    return (
        <>
            {
                employee &&
                <div>
                    <h1>כרטיס עובד - {employee.firstName} {employee.lastName}</h1>

                </div>
            }
        </>
    )
}
