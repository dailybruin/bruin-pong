import { useEffect, useRef} from 'react';
import { Ball } from '../game/Ball';
import { Paddle } from '../game/Paddle';
import { CANVAS_WIDTH, CANVAS_HEIGHT, PADDLE_COLOR } from '../game/constants';

interface CanvasProps {
    ball: Ball;
    paddle: Paddle;
}

export const Canvas: React.FC<CanvasProps> = ({ ball, paddle }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number>(null);
  const keysPressed = useRef<Set<string>>(new Set());

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

      // Draw paddle
      paddle.draw(ctx, PADDLE_COLOR);

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
  }, [ball, paddle]);

  // Mouse drag handling for paddle
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const getCanvasY = (event: MouseEvent): number => {
      const rect = canvas.getBoundingClientRect();
      return event.clientY - rect.top;
    };

    const handleMouseDown = (e: MouseEvent) => {
      const mouseY = getCanvasY(e);
      // Check if mouse is over the paddle
      const paddleX = paddle.x;
      const paddleY = paddle.y;
      const paddleWidth = paddle.width;
      const paddleHeight = paddle.height;
      
      if (e.clientX >= canvas.getBoundingClientRect().left + paddleX &&
          e.clientX <= canvas.getBoundingClientRect().left + paddleX + paddleWidth &&
          mouseY >= paddleY &&
          mouseY <= paddleY + paddleHeight) {
        paddle.startDrag(mouseY);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      if (paddle.isDragging) {
        const mouseY = getCanvasY(e);
        paddle.updateDrag(mouseY);
      }
    };

    const handleMouseUp = () => {
      paddle.endDrag();
    };

    canvas.addEventListener('mousedown', handleMouseDown);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [paddle]);

  // Handling keyboard controls
  useEffect(() => {
    const PADDLE_SPEED = 6; // Adjust this value to change paddle speed

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        e.preventDefault(); // Prevent page scrolling
        keysPressed.current.add(e.key);
        
        // Update paddle velocity based on which keys are pressed
        if (keysPressed.current.has('ArrowUp') && keysPressed.current.has('ArrowDown')) {
          paddle.setVelocity(0); // Both keys cancel out
        } else if (keysPressed.current.has('ArrowUp')) {
          paddle.setVelocity(-PADDLE_SPEED);
        } else if (keysPressed.current.has('ArrowDown')) {
          paddle.setVelocity(PADDLE_SPEED);
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        keysPressed.current.delete(e.key);
        
        // Update paddle velocity based on remaining keys
        if (keysPressed.current.has('ArrowUp') && keysPressed.current.has('ArrowDown')) {
          paddle.setVelocity(0);
        } else if (keysPressed.current.has('ArrowUp')) {
          paddle.setVelocity(-PADDLE_SPEED);
        } else if (keysPressed.current.has('ArrowDown')) {
          paddle.setVelocity(PADDLE_SPEED);
        } else {
          paddle.setVelocity(0); // No keys pressed
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [paddle]);

  return (
    <canvas
      ref={canvasRef}
      width={CANVAS_WIDTH}
      height={CANVAS_HEIGHT}
      style={{
        border: '2px solid #00ff88',
        display: 'block',
        margin: '0 auto',
        cursor: 'pointer',
      }}
    />
  );
};