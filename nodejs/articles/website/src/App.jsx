import { useEffect, useState } from 'react'
import './App.css'
import { Card, CardHeadline, CardImage } from './Card';

function App() {
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    getData();
  }, []);

  const getData = async () => {
    const res = await fetch("http://localhost:3500/articles/website");

    if (res.ok) {
      const data = await res.json();
      setArticles(data);
    }
  }

  return (
    <div className='cards'>
      {
        articles.map(a =>
          <Card key={a._id}>
            <CardImage>{a.imgUrl}</CardImage>
            <CardHeadline>{a.headline}</CardHeadline>
          </Card>
        )
      }
    </div>
  )
}

export default App
