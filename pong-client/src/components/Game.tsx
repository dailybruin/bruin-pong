import { useEffect, useRef } from 'react';
import { Canvas } from './Canvas';
import { Ball } from '../game/Ball';
import { Paddle } from '../game/Paddle';

export const Game: React.FC = () => {
  const ball = useRef(new Ball());
  const paddle = useRef(new Paddle());
  const animationFrameId = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  // Game loop
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update ball physics
      ball.current.updatePosition(deltaTime);
      ball.current.checkWallCollision();
      
      // Check paddle collision
      ball.current.checkPaddleCollision(
        paddle.current.getLeftEdge(),
        paddle.current.getTopEdge(),
        paddle.current.getBottomEdge()
      );

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

  return <Canvas ball={ball.current} paddle={paddle.current} />;
};