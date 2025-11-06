import { useEffect, useRef } from 'react';
import { Canvas } from './Canvas';
import { Ball } from '../game/Ball';

export const Game: React.FC = () => {
  const ball = useRef(new Ball());
  const animationFrameId = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);

  // Game loop (just update the ball for now)
  useEffect(() => {
    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Update ball physics
      ball.current.updatePosition(deltaTime);
      ball.current.checkWallCollision();

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

  return <Canvas ball={ball.current} />;
};