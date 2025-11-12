import { PADDLE_WIDTH, PADDLE_HEIGHT, PADDLE_X, CANVAS_HEIGHT } from './constants';

export class Paddle {
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public isDragging: boolean;
    private dragStartY: number;
    private dragStartMouseY: number;

    constructor() {
        this.width = PADDLE_WIDTH;
        this.height = PADDLE_HEIGHT;
        this.x = PADDLE_X;
        this.y = CANVAS_HEIGHT / 2 - this.height / 2; // Center vertically
        this.isDragging = false;
        this.dragStartY = 0;
        this.dragStartMouseY = 0;
    }

    public startDrag(mouseY: number): void {
        this.isDragging = true;
        this.dragStartY = this.y;
        this.dragStartMouseY = mouseY;
    }

    public updateDrag(mouseY: number): void {
        if (!this.isDragging) return;
        
        const deltaY = mouseY - this.dragStartMouseY;
        const newY = this.dragStartY + deltaY;
        
        // Constrain paddle to canvas bounds
        this.y = Math.max(0, Math.min(CANVAS_HEIGHT - this.height, newY));
    }

    public endDrag(): void {
        this.isDragging = false;
    }

    public getLeftEdge(): number {
        return this.x;
    }

    public getRightEdge(): number {
        return this.x + this.width;
    }

    public getTopEdge(): number {
        return this.y;
    }

    public getBottomEdge(): number {
        return this.y + this.height;
    }

    // Check if a point (ball center) is colliding with the paddle's left face
    public checkCollision(ballX: number, ballY: number, ballRadius: number): boolean {
        // Check if ball is within paddle's vertical range
        const withinVerticalRange = ballY >= this.getTopEdge() && ballY <= this.getBottomEdge();
        
        // Check if ball is touching or past the left edge of the paddle
        const touchingLeftEdge = ballX + ballRadius >= this.getLeftEdge() && 
                                 ballX - ballRadius <= this.getLeftEdge();
        
        return withinVerticalRange && touchingLeftEdge;
    }

    public draw(ctx: CanvasRenderingContext2D, color: string): void {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}

