import { useContext, useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router";
import { icons } from "../config";
import { MyContext } from "../App";

export default function FilesManagers() {
    const [files, setFiles] = useState([]);
    const [fileClicked, setFileClicked] = useState();
    const [isMenu, setIsMenu] = useState(false);
    const [isDrag, setIsDrag] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const menu = useRef();
    const fileInput = useRef();
    const navigate = useNavigate();
    const { folderId } = useParams();
    const { snackbar, loader } = useContext(MyContext);

    const getData = async () => {
        loader(true);

        const res = await fetch(`http://localhost:5000/files/${folderId || 'main'}`);

        if (res.ok) {
            const data = await res.json();
            setFiles(data);
        }

        loader(false);
    }

    useEffect(() => {
        getData();
    }, [folderId]);
    
    useEffect(() => {
        window.addEventListener("click", () => setIsMenu(false));

        return () => window.removeEventListener("click", () => {});
    }, []);

    const createFolder = async () => {
        const folderName = prompt("בחר שם לתיקייה");

        if (!folderName) {
            return;
        }

        loader(true);

        const formData = new FormData();
        formData.append("folderName", folderName);

        const res = await fetch(`http://localhost:5000/files/folder/${folderId || 'main'}`, {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            const folder = await res.json();
            setFiles([...files, folder]);
            snackbar("התיקייה נוצרה בהצלחה");
        }

        loader(false);
    }

    const click = file => {
        if (file.isFolder) {
            navigate(`/folder/${file._id}`);
        } else if (file.type.includes('image')) {
            setPreviewImage(`http://localhost:5000/files/file/${file._id}/${file.fileName}`);
        } else {
            window.open(`http://localhost:5000/files/file/${file._id}/${file.fileName}`, "_blank");
        }
    }

    const back = () => {
        history.back();
    }

    const home = () => {
        navigate('/');
    }

    const rename = async () => {
        const folderName = prompt(`בחר שם ל${fileClicked.isFolder ? 'תיקייה' : 'קובץ'}`, fileClicked.fileName);

        if (!folderName) {
            return;
        }

        loader(true);

        const res = await fetch(`http://localhost:5000/files/${fileClicked._id}/rename/${folderName}`, {
            method: 'PATCH',
        });

        if (res.ok) {
            fileClicked.fileName = folderName;
            setFiles([...files]);
            snackbar(`שם ה${fileClicked.isFolder ? 'תיקייה' : 'קובץ'} השתנה בהצלחה`);
        }

        loader(false);
    }

    const remove = async () => {
        if (!confirm(`האם אתה בטוח כי ברצונך למחוק את ה${fileClicked.isFolder ? 'תיקייה' : 'קובץ'}?`)) {
            return;
        }

        loader(true);

        const res = await fetch(`http://localhost:5000/files/${fileClicked._id}`, {
            method: 'DELETE',
        });

        if (res.ok) {
            setFiles(prev => prev.filter(x => x._id != fileClicked._id));

            if (fileClicked.isFolder) {
                snackbar("התיקייה נמחקה בהצלחה");
            } else {
                snackbar("הקובץ נמחק בהצלחה");
            }
        }

        loader(false);
    }

    const rightClick = (ev, file) => {
        ev.preventDefault();
        setFileClicked(file);

        const bodyWidth = document.body.offsetWidth;
        let leftPosition = ev.pageX;

        if (ev.pageX + menu.current.offsetWidth > bodyWidth) {
            leftPosition -= menu.current.offsetWidth;
        }

        menu.current.style.top = ev.pageY + 'px';
        menu.current.style.left = leftPosition + 'px';
        setIsMenu(true);
    }

    const upload = async ev => {
        const formData = new FormData();

        for (const f of ev.target.files) {
            formData.append("files", f);
        }

        const res = await fetch(`http://localhost:5000/files/${folderId || 'main'}/upload`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            ev.target.value = '';
            getData();
        }
    }

    const dragStart = ev => {
        ev.preventDefault();
        setIsDrag(true);
    }

    const drop = async ev => {
        ev.preventDefault();
        setIsDrag(false);

        const formData = new FormData();

        for (const f of ev.dataTransfer.files) {
            formData.append("files", f);
        }

        const res = await fetch(`http://localhost:5000/files/${folderId || 'main'}/upload`, {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            getData();
        }
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
                    <button className='button' onClick={() => fileInput.current.click()}><i className='fa fa-upload'></i> העלאת קבצים</button>
                </div>
            </div>

            <div className={"files" + (isDrag ? ' drag' : '')} onDragOver={dragStart} onDragLeave={() => setIsDrag(false)} onDrop={drop}>
                {
                    files.length ?
                    files.map(f =>
                        <div className="file" onClick={() => click(f)} onContextMenu={ev => rightClick(ev, f)} key={f._id}>
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

            <div className="context-menu" ref={menu} style={{ display: isMenu ? 'block' : 'none' }}>
                <a href="#" className="menu-item" onClick={rename}><i className='fa fa-edit'></i> שינוי שם</a>
                <a href="#" className="menu-item" onClick={remove}><i className='fa fa-trash'></i> מחיקה</a>
            </div>

            <input type="file" onChange={upload} ref={fileInput} multiple style={{ display: 'none' }} />

            {
                previewImage &&
                <div className="preview">
                    <button className="close" onClick={() => setPreviewImage('')}>x</button>
                    <img src={previewImage} />
                </div>
            }
        </div>
    )
}
