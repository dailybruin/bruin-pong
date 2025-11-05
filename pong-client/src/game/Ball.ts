import { BALL_RADIUS, BALL_INITIAL_SPEED, CANVAS_WIDTH, CANVAS_HEIGHT } from './constants';

export class Ball {
    public x: number;  
    public y: number;
    public radius: number;
    public speed: number;
    public velocityX: number;
    public velocityY: number;

    constructor() {
        this.radius = BALL_RADIUS;
        this.x = CANVAS_WIDTH / 2;
        this.y = CANVAS_HEIGHT / 2;
        this.speed = BALL_INITIAL_SPEED;
        this.velocityX = this.getRandomVelocity(0);
        this.velocityY = this.getRandomVelocity(1);
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

    public updatePosition(): void {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }

    public checkWallCollision(): void {

        // Top and bottom wall collision
        if (this.y - this.radius < 0 || this.y + this.radius > CANVAS_HEIGHT) {
            this.velocityY = -this.velocityY;
        }

        // Left and right wall collision
        if (this.x - this.radius < 0 || this.x + this.radius > CANVAS_WIDTH) {
            this.velocityX = -this.velocityX;
        }
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

