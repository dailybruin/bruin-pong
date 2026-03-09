import { CANVAS_HEIGHT, PADDLE_X, OBSTACLE_MIN_RADIUS, OBSTACLE_MAX_RADIUS } from './constants';

export class Obstacle {
    public x: number;
    public y: number;
    public radius: number;

    constructor() {
        // Random radius between min and max
        this.radius = OBSTACLE_MIN_RADIUS + Math.random() * (OBSTACLE_MAX_RADIUS - OBSTACLE_MIN_RADIUS);
        
        // Spawn obstacles in the middle/left area, avoiding paddle zone
        // Use max radius for bounds to ensure all bears fit within the canvas
        const leftBound = OBSTACLE_MAX_RADIUS + 20;
        const rightBound = PADDLE_X - 50; // Well before paddle
        const topBound = OBSTACLE_MAX_RADIUS + 20;
        const bottomBound = CANVAS_HEIGHT - OBSTACLE_MAX_RADIUS - 20;
        
        this.x = leftBound + Math.random() * (rightBound - leftBound);
        this.y = topBound + Math.random() * (bottomBound - topBound);
    }

    // Check if ball collides with this obstacle
    public checkCollision(ballX: number, ballY: number, ballRadius: number): boolean {
        const dx = ballX - this.x;
        const dy = ballY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        return distance < (this.radius + ballRadius);
    }

    // Get the collision normal vector (for bounce calculation)
    public getCollisionNormal(ballX: number, ballY: number): { nx: number; ny: number } {
        const dx = ballX - this.x;
        const dy = ballY - this.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance === 0) {
            // Edge case: ball center exactly on obstacle center
            return { nx: 1, ny: 0 };
        }
        
        return {
            nx: dx / distance,
            ny: dy / distance
        };
    }

    public draw(ctx: CanvasRenderingContext2D, color: string, ballX: number, ballY: number): void {
        const scale = this.radius / 12; // Scale based on radius
        const size = 12 * scale;
        
        ctx.save();
        ctx.translate(this.x, this.y);
        
        // Draw bear head (main body)
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(0, 0, size * 0.7, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw ears
        ctx.beginPath();
        ctx.arc(-size * 0.5, -size * 0.5, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.5, -size * 0.5, size * 0.25, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw inner ears (lighter brown)
        ctx.fillStyle = '#e8c5a0';
        ctx.beginPath();
        ctx.arc(-size * 0.5, -size * 0.5, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.arc(size * 0.5, -size * 0.5, size * 0.15, 0, Math.PI * 2);
        ctx.fill();
        
        // Eye properties (vertical ovals - vertical radius > horizontal radius)
        const eyeCenterXLeft = -size * 0.2;
        const eyeCenterXRight = size * 0.2;
        const eyeCenterY = -size * 0.15;
        const eyeRadiusX = size * 0.08; // Horizontal radius (smaller)
        const eyeRadiusY = size * 0.12; // Vertical radius (larger)
        
        // Draw eyes (vertical ovals, no rotation)
        ctx.fillStyle = '#ffffff';
        // Left eye
        ctx.beginPath();
        ctx.ellipse(eyeCenterXLeft, eyeCenterY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right eye
        ctx.beginPath();
        ctx.ellipse(eyeCenterXRight, eyeCenterY, eyeRadiusX, eyeRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Calculate pupil positions based on ball position (tracking)
        // Convert ball position to local coordinates (relative to bear center)
        const ballLocalX = ballX - this.x;
        const ballLocalY = ballY - this.y;
        
        // Calculate direction to ball for each eye
        const leftEyeToBallX = ballLocalX - eyeCenterXLeft;
        const leftEyeToBallY = ballLocalY - eyeCenterY;
        const rightEyeToBallX = ballLocalX - eyeCenterXRight;
        const rightEyeToBallY = ballLocalY - eyeCenterY;
        
        // Normalize direction vectors
        const leftEyeDist = Math.sqrt(leftEyeToBallX * leftEyeToBallX + leftEyeToBallY * leftEyeToBallY);
        const rightEyeDist = Math.sqrt(rightEyeToBallX * rightEyeToBallX + rightEyeToBallY * rightEyeToBallY);
        
        // Pupil properties (smaller than eyes)
        const pupilRadiusX = size * 0.05; // Horizontal radius
        const pupilRadiusY = size * 0.07; // Vertical radius
        const maxPupilOffsetX = eyeRadiusX - pupilRadiusX; // Max horizontal movement
        const maxPupilOffsetY = eyeRadiusY - pupilRadiusY; // Max vertical movement
        
        // Calculate pupil positions (constrained within eye bounds)
        let leftPupilX = eyeCenterXLeft;
        let leftPupilY = eyeCenterY;
        let rightPupilX = eyeCenterXRight;
        let rightPupilY = eyeCenterY;
        
        if (leftEyeDist > 0) {
            // Normalize direction
            const leftDirX = leftEyeToBallX / leftEyeDist;
            const leftDirY = leftEyeToBallY / leftEyeDist;
            
            // Scale by max offset (but keep within ellipse bounds)
            const leftOffsetX = Math.min(maxPupilOffsetX, Math.abs(leftDirX * maxPupilOffsetX));
            const leftOffsetY = Math.min(maxPupilOffsetY, Math.abs(leftDirY * maxPupilOffsetY));
            
            leftPupilX = eyeCenterXLeft + (leftDirX > 0 ? leftOffsetX : -leftOffsetX);
            leftPupilY = eyeCenterY + (leftDirY > 0 ? leftOffsetY : -leftOffsetY);
        }
        
        if (rightEyeDist > 0) {
            // Normalize direction
            const rightDirX = rightEyeToBallX / rightEyeDist;
            const rightDirY = rightEyeToBallY / rightEyeDist;
            
            // Scale by max offset (but keep within ellipse bounds)
            const rightOffsetX = Math.min(maxPupilOffsetX, Math.abs(rightDirX * maxPupilOffsetX));
            const rightOffsetY = Math.min(maxPupilOffsetY, Math.abs(rightDirY * maxPupilOffsetY));
            
            rightPupilX = eyeCenterXRight + (rightDirX > 0 ? rightOffsetX : -rightOffsetX);
            rightPupilY = eyeCenterY + (rightDirY > 0 ? rightOffsetY : -rightOffsetY);
        }
        
        // Draw pupils (vertical ovals, tracking ball)
        ctx.fillStyle = '#000000';
        // Left pupil
        ctx.beginPath();
        ctx.ellipse(leftPupilX, leftPupilY, pupilRadiusX, pupilRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        // Right pupil
        ctx.beginPath();
        ctx.ellipse(rightPupilX, rightPupilY, pupilRadiusX, pupilRadiusY, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw nose
        ctx.fillStyle = '#000000';
        ctx.beginPath();
        ctx.ellipse(0, size * 0.1, size * 0.08, size * 0.06, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw mouth
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5 * scale;
        ctx.beginPath();
        ctx.arc(0, size * 0.2, size * 0.15, 0, Math.PI);
        ctx.stroke();
        
        ctx.restore();
    }
}
