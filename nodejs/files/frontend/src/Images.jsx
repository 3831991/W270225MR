import { useEffect, useRef, useState } from "react"

export default function Images() {
    const [images, setImages] = useState([]);
    const fileInput = useRef(null);

    useEffect(() => {
        getImages();
    }, []);

    const getImages = async () => {
        const res = await fetch("http://localhost:3333/files");
        
        if (res.ok) {
            setImages(await res.json());
        }
    }

    const fileChange = async ev => {
        const file = ev.target.files[0];

        const formData = new FormData();
        formData.append("file", file);

        const res = await fetch("http://localhost:3333/files/upload", {
            method: "POST",
            body: formData,
        });

        if (res.ok) {
            getImages();
        }
    }

    const remove = async imageName => {
        if (!confirm("הא למחוק את התמונה?")) {
            return;
        }

        const res = await fetch(`http://localhost:3333/files/${imageName}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setImages(images.filter(img => img != imageName));
        }
    }

    const show = imageName => {
        window.open(`http://localhost:3333/files/${imageName}`, "_blank");
    }

    return (
        <div className="Images">
            {
                images.map(imageName => 
                    <div className="imageFrame" key={imageName}>
                        <div className="image">
                            <img src={`http://localhost:3333/files/${imageName}`} />
                        </div>

                        <div className="actions">
                            <button onClick={() => show(imageName)}>הצג</button>
                            <button onClick={() => remove(imageName)}>מחק</button>
                        </div>
                    </div>
                )
            }
            <div className="uploadFrame">
                {/* חייבים את האלמנט הזה בכדי לייבא קובץ */}
                {/* היות והוא מכוער, הסתרנו אותו והשתמשו בלחצן שיפעיל אותו */}
                <input type="file" ref={fileInput} onChange={fileChange} />
                <button onClick={() => fileInput.current.click()}>בחר תמונה..</button>
            </div>
        </div>
    )
}
