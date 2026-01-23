import { useEffect, useRef, useState } from 'react';
import { Canvas } from './Canvas';
import { Ball } from '../game/Ball';
import { Paddle } from '../game/Paddle';
import { saveScore, getTopScore } from '../services/scoreService';
import './Game.css';

export const Game: React.FC = () => {
  const ball = useRef(new Ball());
  const paddle = useRef(new Paddle());
  const animationFrameId = useRef<number>(null);
  const lastTimeRef = useRef<number>(0);
  const gameOverRef = useRef<boolean>(false);

  const [score, setScore] = useState(0);
  const [topScore, setTopScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const scoreRef = useRef(0);

  // Load top score on mount
  useEffect(() => {
    const loadTopScore = async () => {
      const top = await getTopScore();
      setTopScore(top);
    };
    loadTopScore();
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameStarted) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Don't update if game is over
      if (gameOverRef.current) {
        animationFrameId.current = requestAnimationFrame(gameLoop);
        return;
      }

      // update paddle position (for keyboard)
      paddle.current.updatePosition(deltaTime);

      // Update ball physics
      // Add safety check: if ball has zero velocity but game is not over, give it velocity
      if (ball.current.velocityX === 0 && ball.current.velocityY === 0 && !ball.current.outOfBounds) {
        ball.current.velocityX = -ball.current.speed;
        ball.current.velocityY = ball.current.speed * 0.5;
      }
      
      ball.current.updatePosition(deltaTime);
      ball.current.checkWallCollision();
      
      // Check paddle collision
      if (ball.current.checkPaddleCollision(paddle.current.getLeftEdge(), paddle.current.getTopEdge(), paddle.current.getBottomEdge())) {
        // Reverse ball direction and increase speed
        scoreRef.current += 1; // Update ref immediately
        setScore(scoreRef.current); // Update state for UI
      }

      // Check if ball went out of bounds (right side - hits right edge)
      if (ball.current.isOutOfBounds() && !gameOverRef.current) {
        gameOverRef.current = true;
        setGameOver(true);
        
        // Save score to Firebase
        const finalScore = scoreRef.current;
        saveScore(finalScore).then(() => {
          // Reload top score after saving
          getTopScore().then(top => setTopScore(top));
        });
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
  }, [gameStarted]);

  // Start game function
  const startGame = () => {
    setGameStarted(true);
    // Initialize ball velocity
    ball.current.velocityX = -ball.current.speed * 0.8;
    ball.current.velocityY = (Math.random() - 0.5) * ball.current.speed * 0.6;
  };

  // Reset game function
  const resetGame = () => {
    // Reset game state flags first
    gameOverRef.current = false;
    setGameOver(false);
    
    // Reset ball and paddle
    ball.current.reset();
    paddle.current = new Paddle();
    
    // Reset score
    scoreRef.current = 0;
    setScore(0);
    
    // Reset timing for smooth restart
    lastTimeRef.current = performance.now();
    
    // ALWAYS force set velocities directly - don't rely on reset() alone
    // This ensures the ball definitely moves on restart
    ball.current.velocityX = -ball.current.speed * 0.8; // Always move left
    ball.current.velocityY = (Math.random() - 0.5) * ball.current.speed * 0.6; // Random vertical
    
    // Ensure velocities are definitely not zero
    if (ball.current.velocityX === 0) {
      ball.current.velocityX = -ball.current.speed;
    }
    if (ball.current.velocityY === 0) {
      ball.current.velocityY = ball.current.speed * 0.5;
    }
    
    // Ensure outOfBounds is false
    ball.current.outOfBounds = false;
  };

  // return (
  //   <div>
  //     <div style={{ textAlign: 'center', marginBottom: '10px' }}>
  //       <div>Score: {score}</div>
  //       <div>Top Score: {topScore}</div>
  //       {gameOver && (
  //         <div style={{ marginTop: '10px' }}>
  //           <div style={{ color: 'red', marginBottom: '10px' }}>Game Over! Final Score: {score}</div>
  //           <button onClick={resetGame} style={{ padding: '8px 16px', cursor: 'pointer' }}>
  //             Play Again
  //           </button>
  //         </div>
  //       )}
  //     </div>
  //     <Canvas ball={ball.current} paddle={paddle.current} />
  //   </div>
  // );
  return (
    <div>
      <div className="score-display">
        <div>Score: {score}</div>
        <div>Top Score: {topScore}</div>
      </div>
      <div className="game-container">
        <Canvas ball={ball.current} paddle={paddle.current} />

        {!gameStarted && (
          <div className="game-over-overlay">
            <button onClick={startGame} className="play-again-button">
              Start Game! 
            </button>
          </div>
        )}

        {gameOver && (
          <div className="game-over-overlay">
            <div className="game-over-text">
              Game Over! <br />
              Final Score: {score}
            </div>
            <button onClick={resetGame} className="play-again-button">
              Play Again
            </button>
          </div>
        )}
      </div>
    </div>
  );
};