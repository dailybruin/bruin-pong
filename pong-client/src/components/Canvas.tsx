import { useEffect, useRef} from 'react';
import { Ball } from '../game/Ball';
import { CANVAS_WIDTH, CANVAS_HEIGHT } from '../game/constants';

interface CanvasProps {
    ball: Ball;
}

export const Canvas: React.FC<CanvasProps> = ({ ball }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    // Quick safety check for canvas
    if (!canvas) return;

    // The actual drawing tool (like a paintbrush)
    const ctx = canvas.getContext('2d');
    // Safety check in case browser doesn't support canvas
    if (!ctx) return;

    // Render loop - only draws
    const render = () => {
      // Draw the game screen
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw ball
      ball.draw(ctx, "#1c93e8");

      // Keep rendering
      animationFrameId.current = requestAnimationFrame(render);
    };

    animationFrameId.current = requestAnimationFrame(render);

    // cleanup
    return () => {
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [ball]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        border: '2px solid #00ff88',
        display: 'block',
        margin: '0 auto',
      }}
    />
  );
};