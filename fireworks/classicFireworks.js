/**
 * @file fireworks.js
 * @description Classic exploding fireworks effect for MMM-Birthday module
 * @version 2.0.0
 */

class Fireworks {
    constructor() {
        this.colors = [
            '#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', 
            '#00FFFF', '#FFA500', '#FFD700', '#FF1493', '#7FFFD4'
        ];
        this.particles = [];
        this.endTime = Infinity;
        this.createCanvas();
    }

    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'fixed';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.pointerEvents = 'none';
        this.canvas.style.zIndex = '999998';
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createParticle(x, y, color) {
        return {
            x,
            y,
            color,
            velocity: {
                x: (Math.random() - 0.5) * 8,
                y: (Math.random() - 0.5) * 8
            },
            alpha: 1,
            life: Math.random() * 150 + 50
        };
    }

    createExplosion(x, y, color) {
        const particleCount = 50;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle(x, y, color));
        }
    }

    animate() {
        if (Date.now() < this.endTime) {
            requestAnimationFrame(() => this.animate());

            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

            // Launch new firework
            if (Math.random() < 0.05) {
                const x = Math.random() * this.canvas.width;
                const y = Math.random() * (this.canvas.height - 200) + 100;
                const color = this.colors[Math.floor(Math.random() * this.colors.length)];
                this.createExplosion(x, y, color);
            }

            // Update and draw particles
            this.particles.forEach((particle, index) => {
                particle.velocity.y += 0.05; // gravity
                particle.x += particle.velocity.x;
                particle.y += particle.velocity.y;
                particle.alpha -= 0.005;
                particle.life--;

                if (particle.life <= 0) {
                    this.particles.splice(index, 1);
                    return;
                }

                this.ctx.save();
                this.ctx.globalAlpha = particle.alpha;
                this.ctx.fillStyle = particle.color;
                this.ctx.beginPath();
                this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
                this.ctx.fill();
                this.ctx.restore();
            });
        }
    }

    start(duration) {
        if (!document.body.contains(this.canvas)) {
            document.body.appendChild(this.canvas);
        }
        this.endTime = duration === "infinite" ? Infinity : Date.now() + duration;
        this.animate();
    }

    cleanup() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
    }
}
