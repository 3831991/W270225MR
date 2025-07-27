import { useState } from 'react';
import './Game.css'
import { useEffect } from 'react';
import { useRef } from 'react';
const bricksAmount = 50;
const padding = 6;
const step = 4;

export default function Game() {
    const [bricks, setBricks] = useState([]);
    const [paddleX, setPaddleX] = useState(padding);
    const [ballY, setBallY] = useState(110);
    const [ballX, setBallX] = useState(200);
    
    const horizontal = useRef('top');
    const vertical = useRef('left');
    const interval = useRef();

    const game = useRef();
    const ball = useRef();
    const paddle = useRef();

    const isRightKeyDown = useRef();
    const isLeftKeyDown = useRef();

    useEffect(() => {
        const arr = [];

        for (let i = 0; i < bricksAmount; i++) {
            arr.push(i);
        }

        setBricks(arr);
    }, []);

    const handleKeyDown = ev => {
        if (isRightKeyDown.current || isLeftKeyDown.current) {
            return;
        }

        if (ev.key === 'ArrowLeft') {
            isRightKeyDown.current = true;
            movePaddle();
        } else if (ev.key === 'ArrowRight') {
            isLeftKeyDown.current = true;
            movePaddle();
        }
    }

    const handleKeyUp = ev => {
        if (ev.key === 'ArrowLeft') {
            isRightKeyDown.current = false;
        } else if (ev.key === 'ArrowRight') {
            isLeftKeyDown.current = false;
        }
    }

    const movePaddle = () => {
        if (isRightKeyDown.current) {
            setPaddleX(paddleX => Math.max(padding, paddleX - 10));
            setTimeout(movePaddle, 30);
        } else if (isLeftKeyDown.current) {
            const max = game.current.offsetWidth - paddle.current.offsetWidth - padding;
            setPaddleX(paddleX => Math.min(max, paddleX + 10));
            setTimeout(movePaddle, 30);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("keyup", handleKeyUp);

        clearInterval(interval.current);
        interval.current = setInterval(() => move('left'), 50);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("keyup", handleKeyUp);
        }
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
            const max = paddle.current.offsetParent.offsetTop - ball.current.offsetHeight + 2;

            if (ball.current.offsetTop >= max) {
                const start = paddle.current.offsetLeft - ball.current.offsetWidth - 7;
                const end = paddle.current.offsetLeft + paddle.current.offsetWidth + ball.current.offsetWidth - 7;

                if (ball.current.offsetLeft >= start && ball.current.offsetLeft <= end) {
                    horizontal.current = 'top';
                    return;
                } else {
                    clearInterval(interval.current);
                }
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
