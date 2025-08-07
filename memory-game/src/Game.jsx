import { useEffect, useState } from "react";

const animals = [
    { id: 1, name: 'אריה', icon: '🦁' },
    { id: 2, name: 'פיל', icon: '🐘' },
    { id: 3, name: 'זברה', icon: '🦓' },
    { id: 4, name: 'תנין', icon: '🐊' },
    { id: 5, name: 'ג\'ירפה', icon: '🦒' },
    { id: 6, name: 'דוב', icon: '🐻' },
    { id: 7, name: 'קוף', icon: '🐒' },
    { id: 8, name: 'היפופוטם', icon: '🦛' },
    { id: 9, name: 'טיגריס', icon: '🐯' },
    { id: 10, name: 'חמור', icon: '🦙' },
    { id: 11, name: 'לוויתן', icon: '🐋' },
    { id: 12, name: 'דולפין', icon: '🐬' },
    { id: 13, name: 'קיפוד', icon: '🦔' },
    { id: 14, name: 'תוכי', icon: '🦜' },
    { id: 15, name: 'חתול', icon: '🐱' },
    { id: 16, name: 'כלב', icon: '🐶' },
    { id: 17, name: 'סוס', icon: '🐴' },
    { id: 18, name: 'גדי', icon: '🐐' },
    { id: 19, name: 'ארנב', icon: '🐇' },
    { id: 20, name: 'לטאה', icon: '🦎' }
];

export default function Game() {
    const [cards, setCards] = useState([]);

    useEffect(() => {
        const arr = [];

        animals.forEach(x => {
            arr.push({...x}, {...x});
            arr.sort((a, b) => Math.random() - 0.5);
        });

        setCards(arr);
    }, []);

    const click = card => {
        const showing = cards.filter(x => x.show);

        if (showing.length <= 1) {
            card.show = true;
        } else {
            return;
        }

        if (showing.length == 1) {
            const prev = showing[0];

            if (card.id == prev.id) {
                setTimeout(() => {
                    prev.complete = true;
                    card.complete = true;

                    prev.show = false;
                    card.show = false;

                    setCards(prev => [...prev]);
                }, 1000);
            } else {
                setTimeout(() => {
                    prev.show = false;
                    card.show = false;

                    setCards(prev => [...prev]);
                }, 1000);
            }
        }

        setCards(prev => [...prev]);
    }

    return (
        <>
            <h1>משחק הזיכרון - חיות</h1>

            <div className="board">
                {
                    cards.map((c, i) => 
                        <div key={i} className={'card' + (c.show ? ' show' : '') + (c.complete ? ' complete' : '')} onClick={() => click(c)}>
                            <i>{c.icon}</i>
                            <p>{c.name}</p>
                        </div>
                    )
                }
            </div>

            <div className="animals">
                {
                    cards.filter(x => x.complete).filter((c, i, arr) => arr.findIndex(x => x.id == c.id) == i).map(c => 
                        <span>{c.icon}</span>
                    )
                }
                
            </div>
        </>
    )
}
