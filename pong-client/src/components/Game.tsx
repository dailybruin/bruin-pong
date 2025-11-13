import { useEffect, useRef, useState } from 'react';
import { Canvas } from './Canvas';
import { Ball } from '../game/Ball';
import { Paddle } from '../game/Paddle';

export const Game: React.FC = () => {
  const ball = useRef(new Ball());
  const paddle = useRef(new Paddle());
  const animationFrameId = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  const [score, setScore] = useState(0);
  const scoreRef = useRef(0);

  // Game loop
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update ball physics
      ball.current.updatePosition(deltaTime);
      ball.current.checkWallCollision();
      
      // Check paddle collision
      if (ball.current.checkPaddleCollision(paddle.current.getLeftEdge(), paddle.current.getTopEdge(), paddle.current.getBottomEdge())) {
        // Reverse ball direction and increase speed
        scoreRef.current += 1; // Update ref immediately
        setScore(scoreRef.current); // Update state for UI
        console.log('Score updated:', scoreRef.current);
      }

      // Check if ball went out of bounds (left side)
      if (ball.current.isOutOfBounds()) {
        console.log('Game Over! Final Score:', scoreRef.current);
        console.log(score);
        // For now, just reset the ball and paddle
        // ball.current = new Ball();
        // paddle.current = new Paddle();
        // setScore(0);
      }
      
      // Keep looping by calling requestAnimationFrame again
      animationFrameId.current = requestAnimationFrame(gameLoop);
    };

    lastTimeRef.current = performance.now();
    // Start the first frame of the game
    animationFrameId.current = requestAnimationFrame(gameLoop);

    // Cleanup on unmount
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, []);

  return (
    <div>
      <div>
        Score: {score}
      </div>
      <Canvas ball={ball.current} paddle={paddle.current} />
    </div>
  );
};