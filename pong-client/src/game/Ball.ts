import { BALL_RADIUS, BALL_INITIAL_SPEED, BALL_SPEED_INCREMENT, BALL_MAX_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

export class Ball {
    public x: number;  
    public y: number;
    public radius: number;
    public speed: number;
    public velocityX: number;
    public velocityY: number;
    public outOfBounds: boolean;

    constructor() {
        this.radius = BALL_RADIUS;
        this.x = CANVAS_WIDTH / 2;
        this.y = CANVAS_HEIGHT / 2;
        this.speed = BALL_INITIAL_SPEED;
        this.velocityX = this.getRandomVelocity(0);
        this.velocityY = this.getRandomVelocity(1);
        this.outOfBounds = false;
    }

    private getRandomVelocity(direction: number): number {
        const angle = (Math.random() - 0.5) * (Math.PI / 3); // Random angle between -30° to +30°
        
        if (direction === 0) {
            return -Math.cos(angle) * this.speed;
        }
        else {
            return Math.sin(angle) * this.speed;
        }
        
    }

    public isOutOfBounds(): boolean {
        return this.outOfBounds;
    }

    public updatePosition(deltaTime: number): void {
        // normalizing change in time to 60FPS
        const normDelta = deltaTime / 16.67;
        this.x += this.velocityX*normDelta;
        this.y += this.velocityY*normDelta;
    }

    public checkWallCollision(): void {

        // Top and bottom wall collision
        if (this.y - this.radius < 0 || this.y + this.radius > CANVAS_HEIGHT) {
            this.velocityY = -this.velocityY;
        }

        // Left wall collision
        if (this.x - this.radius < 0) {
            this.velocityX = -this.velocityX;
        }
        
        // Right wall collision - stop the ball (out of bounds)
        // This will be handled as a score event in the game logic (NEED SOME VALUE TO INDICATE OUT OF BOUNDS)
        if (this.x + this.radius > CANVAS_WIDTH) {
            this.velocityX = 0;
            this.velocityY = 0;
            this.outOfBounds = true;
        }
    }

    public checkPaddleCollision(paddleLeftEdge: number, paddleTop: number, paddleBottom: number): boolean {
        // Check if ball is moving towards the paddle (positive velocityX means moving right)
        if (this.velocityX <= 0) return false;

        // Check if ball's right edge has reached or passed the paddle's left edge
        const ballRightEdge = this.x + this.radius;
        if (ballRightEdge < paddleLeftEdge) return false;
        
        // Check if ball hasn't passed through the paddle yet
        const ballLeftEdge = this.x - this.radius;
        if (ballLeftEdge > paddleLeftEdge) return false;

        // Check if ball is within paddle's vertical range (with some tolerance for the radius)
        if (this.y + this.radius < paddleTop || this.y - this.radius > paddleBottom) return false;

        // Ball hit the left face of the paddle - reverse X velocity
        // Also ensure ball doesn't get stuck inside paddle
        if (this.x > paddleLeftEdge) {
            this.x = paddleLeftEdge - this.radius;
        }
        this.velocityX = -this.velocityX;
        
        // Increase speed on paddle hit (up to max speed)
        if (this.speed < BALL_MAX_SPEED) {
            this.increaseSpeed(BALL_SPEED_INCREMENT);
        }
        
        return true;
    }

    // Need function to check out of bounds (past the paddle)

    public reset(): void {
        this.x = CANVAS_WIDTH / 2;
        this.y = CANVAS_HEIGHT / 2;
        this.velocityX = this.getRandomVelocity(0);
        this.velocityY = this.getRandomVelocity(1);
        this.speed = BALL_INITIAL_SPEED;
    }

    public increaseSpeed(increment: number): void {
        this.speed += increment;
        // Maintain direction but update magnitude
        const currentAngle = Math.atan2(this.velocityY, this.velocityX);
        this.velocityX = Math.cos(currentAngle) * this.speed;
        this.velocityY = Math.sin(currentAngle) * this.speed;
    }

      // Render the ball on canvas
    public draw(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
    }

}

