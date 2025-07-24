import { useState } from 'react';
import './Game.css'
import { useEffect } from 'react';
const bricksAmount = 50;

export default function Game() {
    const [bricks, setBricks] = useState([]);

    useEffect(() => {
        const arr = [];

        for (let i = 0; i < bricksAmount; i++) {
            arr.push(i);
        }

        setBricks(arr);
    }, []);

    return (
        <div className='Game'>
            <header>
                {bricks.map(x => 
                    <div className='Brick'></div>
                )}
            </header>

            <div className='Ball'></div>

            <footer>
                <div className='Paddle'></div>
            </footer>
        </div>
    )
}
