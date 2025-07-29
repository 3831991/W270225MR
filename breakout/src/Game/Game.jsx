import { useState } from 'react';
import './Game.css'
import { useEffect } from 'react';
import { useRef } from 'react';
const bricksAmount = 50;
const padding = 6;
const step = 10;
const brickWidth = 800 / 10 - 6; // 10 columns, minus gaps
const brickHeight = 15;

export default function Game() {
    const [bricks, setBricks] = useState([]);
    const [paddleX, setPaddleX] = useState(padding);
    const [ballY, setBallY] = useState(400);
    const [ballX, setBallX] = useState(100);

    const horizontal = useRef('top');
    const vertical = useRef('left');
    const interval = useRef();

    const game = useRef();
    const header = useRef();
    const ball = useRef();
    const paddle = useRef();
    const angle = useRef(0);
    const isGameOver = useRef(false);

    const isRightKeyDown = useRef();
    const isLeftKeyDown = useRef();

    useEffect(() => {
        const arr = [];

        for (let i = 0; i < bricksAmount; i++) {
            const row = Math.floor(i / 10);
            const col = i % 10;

            arr.push({
                i,
                completed: false,
                x: col * (brickWidth + padding),
                y: row * (brickHeight + padding),
                width: brickWidth,
                height: brickHeight,
            });
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
        if (isGameOver.current) {
            return;
        }

        if (isRightKeyDown.current) {
            setPaddleX(paddleX => Math.max(padding, paddleX - 20));
            setTimeout(movePaddle, 30);
        } else if (isLeftKeyDown.current) {
            const max = game.current.offsetWidth - paddle.current.offsetWidth - padding;
            setPaddleX(paddleX => Math.min(max, paddleX + 20));
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

    const mapNumber = x => {
        const minInput = 0;
        const maxInput = 70;
        const minOutput = -8;
        const maxOutput = 18;

        const ratio = (x - minInput) / (maxInput - minInput);
        return minOutput + ratio * (maxOutput - minOutput);
    }

    const move = () => {
        if (isGameOver.current) {
            return;
        }

        if (vertical.current === 'left') {
            if (ball.current.offsetLeft <= padding) {
                vertical.current = 'right';
                return;
            }

            setBallX(prev => prev - step - angle.current);
        } else if (vertical.current === 'right') {
            const max = game.current.offsetWidth - ball.current.offsetWidth - padding;

            if (ball.current.offsetLeft >= max) {
                vertical.current = 'left';
                return;
            }

            setBallX(prev => prev + step + angle.current);
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
                const half = (end - start) / 2;

                if (ball.current.offsetLeft >= start && ball.current.offsetLeft <= end) {
                    horizontal.current = 'top';

                    // בחצי הימני של המשוט
                    if (ball.current.offsetLeft >= start + half) {
                        const position = ball.current.offsetLeft - start - half;
                        angle.current = mapNumber(position);
                        vertical.current = 'right';
                    }
                    // בחצי השמאלי של המשוט
                    else {
                        const position = ball.current.offsetLeft - start;
                        angle.current = mapNumber(position);
                        vertical.current = 'left';
                    }

                    return;
                } else {
                    gameOver();
                }
            }

            setBallY(prev => prev + step);
        }

        check();
    }

    const check = () => {
        if (ball.current.offsetTop > header.current.offsetHeight + padding) {
            return;
        }

        for (const b of header.current.children) {
            if (b.style.visibility == "hidden") {
                continue;
            }

            const start = b.offsetLeft - ball.current.offsetWidth - 7;
            const end = b.offsetLeft + b.offsetWidth + ball.current.offsetWidth - 7;

            if (ball.current.offsetTop <= b.offsetTop + b.offsetHeight && ball.current.offsetLeft >= start && ball.current.offsetLeft <= end) {
                if (horizontal.current == 'top') {
                    horizontal.current = 'bottom';
                } else {
                    horizontal.current = 'bottom';
                }

                b.style.visibility = "hidden";
                return;
            }
        }
    }

    const gameOver = () => {
        isGameOver.current = true;
        clearInterval(interval.current);
    }

    const newGame = () => {
        for (const b of header.current.children) {
            b.style.visibility = "visible";
        }

        horizontal.current = 'top';
        isGameOver.current = false;
        interval.current = setInterval(() => move('left'), 50);
    }

    return (
        <>
            <div className='Game' ref={game}>
                <header ref={header}>
                    {bricks.map(x =>
                        <div className='Brick' key={x.i}></div>
                    )}
                </header>

                <div className='Ball' ref={ball} style={{ left: ballX + 'px', top: ballY + 'px' }}></div>

                <footer>
                    <div className='Paddle' ref={paddle} style={{ left: paddleX + 'px' }}></div>
                </footer>
            </div>

            <div className='actions'>
                {isGameOver.current && <button className='button' onClick={newGame}><i className='fa fa-undo'></i> משחק חדש</button>}
            </div>
        </>
    )
}
