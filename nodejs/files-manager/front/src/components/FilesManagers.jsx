import { useEffect, useState } from "react";
import { icons } from "../config";

export default function FilesManagers() {
    const [files, setFiles] = useState([]);

    const getData = async (folderId = 'main') => {
        const res = await fetch(`http://localhost:5000/files/${folderId}`);

        if (res.ok) {
            const data = await res.json();
            setFiles(data);
        }
    }

    useEffect(() => {
        getData();
    }, []);

    const createFolder = async () => {
        const folderName = prompt("בחר שם לתיקייה");

        if (!folderName) {
            return;
        }

        const folderId = 'main';

        const formData = new FormData();
        formData.append("folderName", folderName);

        const res = await fetch(`http://localhost:5000/files/folder/${folderId}`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const folder = await res.json();
            setFiles([...files, folder]);
        }
    }

    return (
        <div>
            <h1>ניהול קבצים</h1>

            <div className="actions">
                <button className='button' onClick={createFolder}><i className='fa fa-plus'></i> תיקייה חדשה</button>
                <button className='button'><i className='fa fa-upload'></i> העלאת קבצים</button>
            </div>

            <div className="files">
                {
                    files.length ?
                    files.map(f =>
                        <div className="file">
                            {
                                f.isFolder ?
                                    <i className="fa fa-folder"></i> :
                                    <i className={'fa fa-' + (icons[f.type] || 'file')}></i>
                            }
                            <p>{f.fileName}</p>
                        </div>
                    ) :
                    <p className="empty">אין עדיין קבצים</p>
                }
            </div>
        </div>
    )
}
