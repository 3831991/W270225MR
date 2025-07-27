export default function FilesManagers() {
    const files = [
        { fileName: 'תיקיה ראשונה', isFolder: true },
        { fileName: 'תיקיה שנייה', isFolder: true },
        { fileName: 'תיקיה שלישית', isFolder: true },
        { fileName: 'תיקיה רביעית', isFolder: true },
        { fileName: 'תיקיה חמישית', isFolder: true },
        { fileName: 'תיקיה שישית', isFolder: true },
        { fileName: 'תיקיה שביעית', isFolder: true },
    ];
    
    return (
        <div>
            <h1>ניהול קבצים</h1>

            <div className="files">
                {
                    files.map(f => 
                        <div className="file">
                            <i className="fa fa-folder"></i>
                            <p>{f.fileName}</p>
                        </div>
                    )
                }
            </div>
        </div>
    )
}
