import { useParams } from 'react-router';
import './EmployeeCard.css';
import { useEffect, useState } from 'react';

export default function EmployeeCard() {
    const [employee, setEmployee] = useState();
    const { id } = useParams();

    useEffect(() => {
        getEmployee();
    }, [id]);

    const getEmployee = async () => {
        const res = await fetch(`http://localhost:4000/employees/${id}`);

        if (res.ok) {
            setEmployee(await res.json());
        } else {
            setEmployee(null);
        }
    }

    return (
        <>
            {
                employee ?
                <div className="employee-card">
                    <div className="employee-card-header">
                        <img src={`http://localhost:4000/employees/images/${employee.image._id}`} className="employee-image" />
                        <h2 className="employee-name">{employee.firstName} {employee.lastName}</h2>
                    </div>

                    <div className="employee-details">
                        <p><strong>תעודת זהות:</strong> {employee.personalId}</p>
                        <p><strong>טלפון:</strong> {employee.phone}</p>
                        <p><strong>אימייל:</strong> {employee.email}</p>
                        <p><strong>תאריך לידה:</strong> {new Date(employee.birthDate).toLocaleDateString()}</p>
                    </div>

                    <div className="employee-address">
                        <h3>כתובת:</h3>
                        <p>{employee.address.street} {employee.address.house}, {employee.address.city}</p>
                    </div>

                    <div className="employee-gender">
                        <p><strong>מין:</strong> {employee.gender}</p>
                    </div>
                </div> : 
                (employee === null ? <div className='EmployeeEmpty'>לא נמצא עובד - {id}</div> : '')
            }
        </>
    )
}
