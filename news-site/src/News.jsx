import { useEffect, useState } from "react";
import { Card, CardContent, CardMedia, Typography } from '@mui/material';
import { Link } from "react-router";

export default function News() {
    const [news, setNews] = useState([]);

    const getNews = async () => {
        const res = await fetch("https://api.shipap.co.il/articles?token=62e49732-824e-11ee-beec-14dda9d4a5f0");
        const data = await res.json();
        setNews(data);
    }

    useEffect(() => {
        getNews();
    }, []);

    return (
        <div className="news">
            {
                news.map(x =>
                    <div className="Card" key={x.id}>
                        <Link to={`/${x.id}`}>
                            <Card sx={{ display: 'flex', flexDirection: 'column' }}>
                                <CardMedia
                                    component="img"
                                    height="200"
                                    image={x.imgUrl}
                                    alt={x.headline}
                                />

                                <CardContent>
                                    <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
                                        {x.headline}
                                    </Typography>

                                    <Typography variant="body2" color="text.secondary" sx={{ marginTop: 1 }}>
                                        {x.description}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Link>
                    </div>
                )
            }
        </div>
    )
}

// id
// publishDate
// headline
// description
// imgUrl