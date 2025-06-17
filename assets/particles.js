// Advanced Particles Animation System
class ParticleSystem {
    constructor(container, options = {}) {
        this.container = container;
        this.particles = [];
        this.animationId = null;
        this.isPlaying = true;
        
        // Default configuration
        this.config = {
            particleCount: 50,
            particleSize: { min: 1, max: 4 },
            particleSpeed: { min: 0.5, max: 2 },
            particleOpacity: { min: 0.1, max: 0.6 },
            particleColor: '#6366f1',
            connectionDistance: 150,
            connectionOpacity: 0.1,
            mouseInteraction: true,
            mouseRadius: 100,
            mouseForce: 0.1,
            ...options
        };
        
        this.mouse = { x: 0, y: 0 };
        this.canvas = null;
        this.ctx = null;
        
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.createParticles();
        this.bindEvents();
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 1;
        `;
        
        this.ctx = this.canvas.getContext('2d');
        this.container.appendChild(this.canvas);
        this.resizeCanvas();
    }
    
    resizeCanvas() {
        const rect = this.container.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
    }
    
    createParticles() {
        this.particles = [];
        
        for (let i = 0; i < this.config.particleCount; i++) {
            this.particles.push(new Particle(this.canvas, this.config));
        }
    }
    
    bindEvents() {
        if (this.config.mouseInteraction) {
            this.container.addEventListener('mousemove', (e) => {
                const rect = this.container.getBoundingClientRect();
                this.mouse.x = e.clientX - rect.left;
                this.mouse.y = e.clientY - rect.top;
            });
            
            this.container.addEventListener('mouseleave', () => {
                this.mouse.x = -1000;
                this.mouse.y = -1000;
            });
        }
        
        window.addEventListener('resize', () => {
            this.resizeCanvas();
        });
        
        // Handle theme changes
        const observer = new MutationObserver(() => {
            this.updateTheme();
        });
        
        observer.observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['data-theme']
        });
    }
    
    updateTheme() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        this.config.particleColor = isDark ? '#8b5cf6' : '#6366f1';
        this.config.connectionOpacity = isDark ? 0.15 : 0.1;
    }
    
    drawConnections() {
        this.ctx.strokeStyle = this.config.particleColor;
        this.ctx.lineWidth = 1;
        
        for (let i = 0; i < this.particles.length; i++) {
            for (let j = i + 1; j < this.particles.length; j++) {
                const dx = this.particles[i].x - this.particles[j].x;
                const dy = this.particles[i].y - this.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < this.config.connectionDistance) {
                    const opacity = (1 - distance / this.config.connectionDistance) * this.config.connectionOpacity;
                    this.ctx.globalAlpha = opacity;
                    
                    this.ctx.beginPath();
                    this.ctx.moveTo(this.particles[i].x, this.particles[i].y);
                    this.ctx.lineTo(this.particles[j].x, this.particles[j].y);
                    this.ctx.stroke();
                }
            }
        }
        
        this.ctx.globalAlpha = 1;
    }
    
    animate() {
        if (!this.isPlaying) return;
        
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach(particle => {
            particle.update(this.mouse, this.config);
            particle.draw(this.ctx);
        });
        
        // Draw connections
        this.drawConnections();
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    play() {
        if (!this.isPlaying) {
            this.isPlaying = true;
            this.animate();
        }
    }
    
    pause() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
        }
    }
    
    destroy() {
        this.pause();
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
    }
}

class Particle {
    constructor(canvas, config) {
        this.canvas = canvas;
        this.reset(config);
        
        // Random initial velocity
        this.vx = (Math.random() - 0.5) * config.particleSpeed.max;
        this.vy = (Math.random() - 0.5) * config.particleSpeed.max;
        
        // Original velocity for restoration
        this.originalVx = this.vx;
        this.originalVy = this.vy;
    }
    
    reset(config) {
        this.x = Math.random() * this.canvas.width;
        this.y = Math.random() * this.canvas.height;
        this.size = Math.random() * (config.particleSize.max - config.particleSize.min) + config.particleSize.min;
        this.opacity = Math.random() * (config.particleOpacity.max - config.particleOpacity.min) + config.particleOpacity.min;
        this.baseOpacity = this.opacity;
    }
    
    update(mouse, config) {
        // Mouse interaction
        if (config.mouseInteraction) {
            const dx = mouse.x - this.x;
            const dy = mouse.y - this.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < config.mouseRadius) {
                const force = (config.mouseRadius - distance) / config.mouseRadius * config.mouseForce;
                this.vx -= (dx / distance) * force;
                this.vy -= (dy / distance) * force;
                
                // Increase opacity when near mouse
                this.opacity = Math.min(1, this.baseOpacity + force);
            } else {
                // Gradually return to original velocity
                this.vx += (this.originalVx - this.vx) * 0.01;
                this.vy += (this.originalVy - this.vy) * 0.01;
                this.opacity += (this.baseOpacity - this.opacity) * 0.01;
            }
        }
        
        // Update position
        this.x += this.vx;
        this.y += this.vy;
        
        // Boundary wrapping
        if (this.x < 0) this.x = this.canvas.width;
        if (this.x > this.canvas.width) this.x = 0;
        if (this.y < 0) this.y = this.canvas.height;
        if (this.y > this.canvas.height) this.y = 0;
        
        // Apply friction
        this.vx *= 0.99;
        this.vy *= 0.99;
        
        // Ensure minimum speed
        if (Math.abs(this.vx) < config.particleSpeed.min && Math.abs(this.vy) < config.particleSpeed.min) {
            this.vx = this.originalVx;
            this.vy = this.originalVy;
        }
    }
    
    draw(ctx) {
        ctx.save();
        ctx.globalAlpha = this.opacity;
        
        // Create gradient for particle
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, this.getParticleColor());
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
    
    getParticleColor() {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        return isDark ? '#8b5cf6' : '#6366f1';
    }
}

// Interactive Background Effects
class BackgroundEffects {
    constructor() {
        this.effects = [];
        this.init();
    }
    
    init() {
        this.createFloatingShapes();
        this.createGradientOrbs();
    }
    
    createFloatingShapes() {
        const hero = document.querySelector('.hero');
        if (!hero) return;
        
        for (let i = 0; i < 5; i++) {
            const shape = document.createElement('div');
            shape.className = 'floating-shape';
            shape.style.cssText = `
                position: absolute;
                width: ${Math.random() * 100 + 50}px;
                height: ${Math.random() * 100 + 50}px;
                background: linear-gradient(45deg, rgba(99, 102, 241, 0.1), rgba(139, 92, 246, 0.1));
                border-radius: ${Math.random() > 0.5 ? '50%' : '20%'};
                left: ${Math.random() * 100}%;
                top: ${Math.random() * 100}%;
                animation: float-shape ${Math.random() * 20 + 10}s linear infinite;
                pointer-events: none;
                z-index: 0;
            `;
            hero.appendChild(shape);
        }
        
        // Add CSS animation
        if (!document.querySelector('#floating-shapes-style')) {
            const style = document.createElement('style');
            style.id = 'floating-shapes-style';
            style.textContent = `
                @keyframes float-shape {
                    0% { transform: translateY(100vh) rotate(0deg) scale(0); opacity: 0; }
                    10% { opacity: 0.1; transform: scale(1); }
                    90% { opacity: 0.1; }
                    100% { transform: translateY(-100vh) rotate(360deg) scale(0); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    createGradientOrbs() {
        const sections = document.querySelectorAll('section:nth-child(even)');
        
        sections.forEach(section => {
            const orb = document.createElement('div');
            orb.className = 'gradient-orb';
            orb.style.cssText = `
                position: absolute;
                width: 300px;
                height: 300px;
                background: radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%);
                border-radius: 50%;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation: pulse-orb ${Math.random() * 10 + 5}s ease-in-out infinite;
                pointer-events: none;
                z-index: 0;
            `;
            section.style.position = 'relative';
            section.appendChild(orb);
        });
        
        // Add CSS animation
        if (!document.querySelector('#gradient-orbs-style')) {
            const style = document.createElement('style');
            style.id = 'gradient-orbs-style';
            style.textContent = `
                @keyframes pulse-orb {
                    0%, 100% { transform: scale(1) rotate(0deg); opacity: 0.3; }
                    50% { transform: scale(1.2) rotate(180deg); opacity: 0.6; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Initialize particle system and background effects
document.addEventListener('DOMContentLoaded', () => {
    const particlesContainer = document.getElementById('particles');
    if (particlesContainer) {
        const particleSystem = new ParticleSystem(particlesContainer, {
            particleCount: window.innerWidth < 768 ? 30 : 50,
            connectionDistance: window.innerWidth < 768 ? 100 : 150,
            mouseInteraction: window.innerWidth >= 768
        });
        
        // Handle visibility change for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                particleSystem.pause();
            } else {
                particleSystem.play();
            }
        });
        
        // Responsive adjustments
        window.addEventListener('resize', () => {
            particleSystem.config.particleCount = window.innerWidth < 768 ? 30 : 50;
            particleSystem.config.connectionDistance = window.innerWidth < 768 ? 100 : 150;
            particleSystem.config.mouseInteraction = window.innerWidth >= 768;
            particleSystem.createParticles();
        });
    }
    
    // Initialize background effects
    new BackgroundEffects();
});

// Export for external use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { ParticleSystem, BackgroundEffects };
}
