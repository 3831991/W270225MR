import { useState } from 'react';
import './Game.css'
import { useEffect } from 'react';
import { useRef } from 'react';
const bricksAmount = 50;
const padding = 6;
const step = 1;

export default function Game() {
    const [bricks, setBricks] = useState([]);
    const [paddleX, setPaddleX] = useState(padding);
    const [ballY, setBallY] = useState(110);
    const [ballX, setBallX] = useState(200);
    
    const horizontal = useRef('top');
    const vertical = useRef('left');

    const game = useRef();
    const ball = useRef();
    const paddle = useRef();

    useEffect(() => {
        const arr = [];

        for (let i = 0; i < bricksAmount; i++) {
            arr.push(i);
        }

        setBricks(arr);
    }, []);

    const handleKeyDown = ev => {
        if (ev.key === 'ArrowLeft') {
            setPaddleX(paddleX => Math.max(padding, paddleX - 20));
        } else if (ev.key === 'ArrowRight') {
            const max = game.current.offsetWidth - paddle.current.offsetWidth - padding;
            setPaddleX(paddleX => Math.min(max, paddleX + 10));
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);

        setInterval(() => move('left'), 20);

        return () => window.removeEventListener("keydown", handleKeyDown)
    }, []);

    const move = () => {
        if (vertical.current === 'left') {
            if (ball.current.offsetLeft <= padding) {
                vertical.current = 'right';
                return;
            }

            setBallX(prev => prev - step);
        } else if (vertical.current === 'right') {
            const max = game.current.offsetWidth - ball.current.offsetWidth - padding;

            if (ball.current.offsetLeft >= max) {
                vertical.current = 'left';
                return;
            }

            setBallX(prev => prev + step);
        }
        
        if (horizontal.current === 'top') {
            if (ball.current.offsetTop <= padding) {
                horizontal.current = 'bottom';
                return;
            }

            setBallY(prev => prev - step);
        } else if (horizontal.current === 'bottom') {
            const max = game.current.offsetHeight - ball.current.offsetHeight - padding;

            if (ball.current.offsetTop >= max) {
                horizontal.current = 'top';
                return;
            }

            setBallY(prev => prev + step);
        }
    }

    return (
        <div className='Game' ref={game}>
            <header>
                {bricks.map(x => 
                    <div className='Brick' key={x}></div>
                )}
            </header>

            <div className='Ball' ref={ball} style={{ left: ballX + 'px', top: ballY + 'px' }}></div>

            <footer>
                <div className='Paddle' ref={paddle} style={{ left: paddleX + 'px' }}></div>
            </footer>
        </div>
    )
}
