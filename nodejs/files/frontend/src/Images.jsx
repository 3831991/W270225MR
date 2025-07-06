import { useEffect, useState } from "react"

export default function Images() {
    const [images, setImages] = useState([]);

    useEffect(() => {
        getImages();
    }, []);

    const getImages = async () => {
        const res = await fetch("http://localhost:3333/files");
        
        if (res.ok) {
            setImages(await res.json());
        }
    }

    return (
        <div>Images</div>
    )
}
