import { useState } from "react";
import { icons } from "../config";

export default function FilesManagers() {
    const [files, setFiles] = useState([
        { fileName: 'תיקיה ראשונה', isFolder: true },
        { fileName: 'תיקיה שנייה', isFolder: true },
        { fileName: 'תיקיה שלישית', isFolder: true },
        { fileName: 'תיקיה רביעית', isFolder: true },
        { fileName: 'תיקיה חמישית', isFolder: true },
        { fileName: 'img4.jpg', type: 'jpg', isFolder: false },
        { fileName: 'logo.png', type: 'png', isFolder: false },
        { fileName: 'animation.gif', type: 'gif', isFolder: false },
        { fileName: 'vector.svg', type: 'svg', isFolder: false },
        { fileName: 'document.pdf', type: 'pdf', isFolder: false },
        { fileName: 'notes.txt', type: 'plain', isFolder: false },
        { fileName: 'archive.zip', type: 'zip', isFolder: false },
    ]);

    const createFolder = () => {
        const folderName = prompt("בחר שם לתיקייה");

        if (!folderName) {
            return;
        }

        setFiles([...files, { fileName: folderName, isFolder: true }]);
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
                    files.map(f =>
                        <div className="file">
                            {
                                f.isFolder ?
                                    <i className="fa fa-folder"></i> :
                                    <i className={'fa fa-' + (icons[f.type] || 'file')}></i>
                            }
                            <p>{f.fileName}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
