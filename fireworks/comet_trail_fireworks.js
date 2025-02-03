/**
 * @file fireworks.js
 * @description Combined fireworks effect with trails for MMM-Birthday module
 * @version 1.0.0
 */

class Fireworks {
    constructor() {
        // Initialize basic properties
        this.colors = [
            '#ff0000', '#ffa500', '#ffff00', '#00ff00', 
            '#00ffff', '#0000ff', '#ff00ff', '#ff1493',
            '#FFD700', '#7FFFD4', '#FF69B4', '#32CD32'
        ];
        this.particles = [];
        this.rockets = [];
        this.endTime = Infinity;
        this.lastLaunch = 0;
        this.launchInterval = 400;
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
        
        // Bind resize event
        this.resizeHandler = () => this.resizeCanvas();
        window.addEventListener('resize', this.resizeHandler);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createRocket(x, y) {
        return {
            x,
            y,
            targetY: this.canvas.height * 0.2 + Math.random() * (this.canvas.height * 0.3),
            targetX: x + (Math.random() - 0.5) * 200,
            speed: 8,
            trail: [],
            trailLength: 5,
            exploded: false,
            color: this.colors[Math.floor(Math.random() * this.colors.length)]
        };
    }

    createParticle(x, y, color) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4;
        return {
            x,
            y,
            color,
            velocity: {
                x: Math.cos(angle) * speed,
                y: Math.sin(angle) * speed
            },
            alpha: 1,
            friction: 0.98,
            gravity: 0.15,
            decay: Math.random() * 0.02 + 0.02
        };
    }

    updateRocket(rocket) {
        const dx = rocket.targetX - rocket.x;
        const dy = rocket.targetY - rocket.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 5) {
            rocket.exploded = true;
            this.createExplosion(rocket.x, rocket.y, rocket.color);
            return false;
        }

        const vx = (dx / distance) * rocket.speed;
        const vy = (dy / distance) * rocket.speed;
        
        rocket.x += vx;
        rocket.y += vy;

        // Update trail
        rocket.trail.push({ x: rocket.x, y: rocket.y });
        if (rocket.trail.length > rocket.trailLength) {
            rocket.trail.shift();
        }

        return true;
    }

    createExplosion(x, y, color) {
        const particleCount = 60;
        for (let i = 0; i < particleCount; i++) {
            this.particles.push(this.createParticle(x, y, color));
        }
    }

    animate() {
        if (Date.now() >= this.endTime) {
            this.cleanup();
            return;
        }

        requestAnimationFrame(() => this.animate());

        // Clear canvas with fade effect
        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Launch new rockets
        const now = Date.now();
        if (now - this.lastLaunch > this.launchInterval) {
            const x = Math.random() * this.canvas.width;
            const y = this.canvas.height;
            this.rockets.push(this.createRocket(x, y));
            this.lastLaunch = now;
            this.launchInterval = 300 + Math.random() * 200;
        }

        // Update and draw rockets
        this.rockets = this.rockets.filter(rocket => {
            if (!rocket.exploded) {
                // Draw rocket trail
                this.ctx.beginPath();
                this.ctx.moveTo(rocket.trail[0]?.x || rocket.x, rocket.trail[0]?.y || rocket.y);
                rocket.trail.forEach(point => {
                    this.ctx.lineTo(point.x, point.y);
                });
                this.ctx.strokeStyle = '#fff';
                this.ctx.lineWidth = 2;
                this.ctx.stroke();

                // Draw rocket
                this.ctx.beginPath();
                this.ctx.arc(rocket.x, rocket.y, 2, 0, Math.PI * 2);
                this.ctx.fillStyle = '#fff';
                this.ctx.fill();

                return this.updateRocket(rocket);
            }
            return false;
        });

        // Update and draw particles
        this.particles = this.particles.filter(particle => {
            // Update position
            particle.x += particle.velocity.x;
            particle.y += particle.velocity.y;

            // Apply physics
            particle.velocity.x *= particle.friction;
            particle.velocity.y *= particle.friction;
            particle.velocity.y += particle.gravity;
            particle.alpha -= particle.decay;

            if (particle.alpha <= 0) return false;

            // Draw particle with glow effect
            this.ctx.save();
            this.ctx.globalAlpha = particle.alpha;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, 2, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowBlur = 4;
            this.ctx.shadowColor = particle.color;
            this.ctx.fill();
            this.ctx.restore();

            return true;
        });
    }

    start(duration) {
        if (!document.body.contains(this.canvas)) {
            document.body.appendChild(this.canvas);
        }
        this.endTime = duration === "infinite" ? Infinity : Date.now() + duration;
        this.lastLaunch = Date.now();
        this.animate();
    }

    cleanup() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        window.removeEventListener('resize', this.resizeHandler);
        this.particles = [];
        this.rockets = [];
        this.endTime = 0;
    }
}
