import { useNavigate, useParams } from 'react-router';
import './EmployeeCard.css';
import { useContext, useEffect, useState } from 'react';
import { MyContext } from '../App';

export default function EmployeeCard() {
    const [employee, setEmployee] = useState();
    const { id } = useParams();
    const navigate = useNavigate();
    const { snackbar, setIsLoader } = useContext(MyContext);
    const token = localStorage.getItem('token');

    useEffect(() => {
        getEmployee();
    }, [id]);

    const getEmployee = async () => {
        setIsLoader(true);

        const res = await fetch(`http://localhost:4000/employees/${id}`, {
            headers: {
                'Authorization': localStorage.getItem('token'),
            },
        });

        if (res.ok) {
            setEmployee(await res.json());
        } else {
            setEmployee(null);
        }

        setIsLoader(false);
    }

    return (
        <>
            <br />
            <button className='button' onClick={() => navigate(`/`)}><i className='fa fa-arrow-right'></i> לרשימת העובדים</button>    

            {
                employee ?
                <div className="employee-card">
                    <div className="employee-card-header">
                        <img src={`http://localhost:4000/employees/images/${employee.image._id}?authorization=${token}`} className="employee-image" />
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

                    <button className='button' onClick={() => navigate(`/employee/edit/${employee._id}`)}><i className='fa fa-edit'></i> עריכה</button>    
                </div> : 
                (employee === null ? <div className='EmployeeEmpty'>לא נמצא עובד - {id}</div> : '')
            }
        </>
    )
}
