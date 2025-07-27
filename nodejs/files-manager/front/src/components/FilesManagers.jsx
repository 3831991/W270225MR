import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { icons } from "../config";

export default function FilesManagers() {
    const [files, setFiles] = useState([]);
    const navigate = useNavigate();
    const { folderId } = useParams();

    const getData = async () => {
        const res = await fetch(`http://localhost:5000/files/${folderId || 'main'}`);

        if (res.ok) {
            const data = await res.json();
            setFiles(data);
        }
    }

    useEffect(() => {
        getData();
    }, [folderId]);

    const createFolder = async () => {
        const folderName = prompt("בחר שם לתיקייה");

        if (!folderName) {
            return;
        }

        const formData = new FormData();
        formData.append("folderName", folderName);

        const res = await fetch(`http://localhost:5000/files/folder/${folderId || 'main'}`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const folder = await res.json();
            setFiles([...files, folder]);
        }
    }

    const click = file => {
        if (file.isFolder) {
            navigate(`/folder/${file._id}`);
        } else {

        }
    }

    const back = () => {
        history.back();
    }

    const home = () => {
        navigate('/');
    }

    return (
        <div>
            <h1>ניהול קבצים</h1>

            <div className="actions">
                <div>
                    {folderId && <button className='button' onClick={back}><i className='fa fa-arrow-right'></i> אחורה</button>}
                    {folderId && <button className='button' onClick={home}><i className='fa fa-home'></i> ראשי</button>}
                </div>
                <div>
                    <button className='button' onClick={createFolder}><i className='fa fa-plus'></i> תיקייה חדשה</button>
                    <button className='button'><i className='fa fa-upload'></i> העלאת קבצים</button>
                </div>
            </div>

            <div className="files">
                {
                    files.length ?
                    files.map(f =>
                        <div className="file" onClick={() => click(f)} key={f._id}>
                            {
                                f.isFolder ?
                                    <i className="fa fa-folder"></i> :
                                    <i className={'fa fa-' + (icons[f.type] || 'file')}></i>
                            }
                            <p>{f.fileName}</p>
                        </div>
                    ) :
                    <p className="empty">ריק</p>
                }
            </div>
        </div>
    )
}
