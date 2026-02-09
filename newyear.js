/**
 * 新年祝福页面 - 优化版
 * 现代设计 + 音乐 + 粒子效果
 */

'use strict';

// ==================== 配置 ====================
const CONFIG = {
    TOTAL_CARDS: 6,
    GAME_DURATION: 30,
    ANIMALS: ['🐼', '🦁', '🐯', '🦒', '🦓', '🦊', '🐨', '🐵'],
    WISHES: [
        '愿你在新的一年里，遇见更多美好的事物 🌸',
        '愿你的笑容永远灿烂，心情永远明媚 ☀️',
        '愿你的每一天都充满惊喜和快乐 🎈'
    ],
    EMOJI_PACKS: [
        { emoji: '🎊', text: '新年快乐！2026一定要开心！' },
        { emoji: '😄', text: '你笑起来真好看！' },
        { emoji: '🎉', text: '恭喜发财，大吉大利！' },
        { emoji: '💪', text: '加油！你是最棒的！' },
        { emoji: '🌟', 'text': '你就是最亮的星！' },
        { emoji: '🎈', text: '开心每一天！' },
        { emoji: '🦁', text: '动物园之王！' },
        { emoji: '🐼', text: '国宝级可爱！' },
        { emoji: '🎯', text: '心想事成！' },
        { emoji: '☀️', text: '阳光灿烂每一天！' }
    ],
    PARTICLE_COUNT: 50,
    COLORS: ['#e74c3c', '#f39c12', '#ffd700', '#ff6b6b', '#f1c40f']
};

// ==================== 状态 ====================
const State = {
    collectedCards: 0,
    musicPlaying: false,
    catchScore: 0,
    catchGameActive: false,
    catchTimeLeft: CONFIG.GAME_DURATION,
    secretNumber: Math.floor(Math.random() * 10) + 1,
    audioContext: null,
    particles: []
};

// ==================== DOM 元素 ====================
const DOM = {};

function cacheDOM() {
    DOM.loader = document.getElementById('loader');
    DOM.musicControl = document.getElementById('musicControl');
    DOM.musicIcon = document.getElementById('musicIcon');
    DOM.bgMusic = document.getElementById('bgMusic');
    DOM.particleCanvas = document.getElementById('particleCanvas');
    DOM.introScreen = document.getElementById('introScreen');
    DOM.mainContent = document.getElementById('mainContent');
    DOM.collectedCount = document.getElementById('collectedCount');
    DOM.progressFill = document.getElementById('progressFill');
    DOM.wishDisplay = document.getElementById('wishDisplay');
    DOM.completeModal = document.getElementById('completeModal');
    DOM.catchArea = document.getElementById('catchArea');
    DOM.catchScore = document.getElementById('catchScore');
    DOM.catchTime = document.getElementById('catchTime');
    DOM.guessInput = document.getElementById('guessInput');
    DOM.guessHint = document.getElementById('guessHint');
    DOM.emojiDisplay = document.getElementById('emojiDisplay');
    DOM.toastContainer = document.getElementById('toastContainer');
    DOM.fireworkCanvas = document.getElementById('fireworkCanvas');
}

// ==================== 初始化 ====================
document.addEventListener('DOMContentLoaded', () => {
    cacheDOM();
    initParticles();
    initAudio();
    
    // 模拟加载
    setTimeout(() => {
        DOM.loader?.classList.add('hidden');
    }, 1500);
    
    // 滚动监听
    window.addEventListener('scroll', handleScroll);
});

// ==================== 粒子背景 ====================
function initParticles() {
    if (!DOM.particleCanvas) return;
    
    const canvas = DOM.particleCanvas;
    const ctx = canvas.getContext('2d');
    
    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    
    // 创建粒子
    class Particle {
        constructor() {
            this.reset();
        }
        
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = (Math.random() - 0.5) * 0.5;
            this.speedY = (Math.random() - 0.5) * 0.5;
            this.color = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
            this.opacity = Math.random() * 0.5 + 0.2;
        }
        
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            
            if (this.x < 0 || this.x > canvas.width || 
                this.y < 0 || this.y > canvas.height) {
                this.reset();
            }
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.globalAlpha = this.opacity;
            ctx.fill();
            ctx.globalAlpha = 1;
        }
    }
    
    // 初始化粒子
    for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
        State.particles.push(new Particle());
    }
    
    // 连线
    function drawConnections() {
        for (let i = 0; i < State.particles.length; i++) {
            for (let j = i + 1; j < State.particles.length; j++) {
                const dx = State.particles[i].x - State.particles[j].x;
                const dy = State.particles[i].y - State.particles[j].y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(State.particles[i].x, State.particles[i].y);
                    ctx.lineTo(State.particles[j].x, State.particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }
    
    // 动画循环
    let frameCount = 0;
    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        State.particles.forEach(p => {
            p.update();
            p.draw();
        });
        
        // 每3帧绘制一次连线，优化性能
        if (frameCount % 3 === 0) {
            drawConnections();
        }
        frameCount++;
        
        requestAnimationFrame(animate);
    }
    animate();
}

// ==================== 音频控制 ====================
function initAudio() {
    // 尝试自动播放
    const tryAutoplay = () => {
        if (DOM.bgMusic && !State.musicPlaying) {
            DOM.bgMusic.volume = 0.4;
            DOM.bgMusic.play().then(() => {
                State.musicPlaying = true;
                updateMusicIcon();
            }).catch(() => {
                // 自动播放被阻止，等待用户交互
            });
        }
    };
    
    // 首次点击页面时尝试播放
    document.addEventListener('click', tryAutoplay, { once: true });
}

function toggleMusic() {
    if (!DOM.bgMusic) return;
    
    if (State.musicPlaying) {
        DOM.bgMusic.pause();
        State.musicPlaying = false;
    } else {
        DOM.bgMusic.play();
        State.musicPlaying = true;
    }
    
    updateMusicIcon();
}

function updateMusicIcon() {
    if (!DOM.musicIcon || !DOM.musicControl) return;
    
    DOM.musicIcon.textContent = State.musicPlaying ? '🎵' : '🔇';
    
    if (State.musicPlaying) {
        DOM.musicControl.classList.remove('paused');
    } else {
        DOM.musicControl.classList.add('paused');
    }
}

// ==================== 开场动画 ====================
function startExperience() {
    if (!DOM.introScreen || !DOM.mainContent) return;
    
    DOM.introScreen.classList.add('hidden');
    
    setTimeout(() => {
        DOM.mainContent.classList.add('active');
        playTone(523.25, 0.2, 0.3); // C5
    }, 500);
}

// ==================== 卡片功能 ====================
function openCard(cardNum) {
    const cards = document.querySelectorAll('.card');
    const card = cards[cardNum - 1];
    
    if (!card || card.classList.contains('flipped')) return;
    
    card.classList.add('flipped');
    State.collectedCards++;
    
    updateProgress();
    playTone(659.25, 0.15, 0.2); // E5
    
    // 添加闪光效果
    const shine = document.createElement('div');
    shine.style.cssText = `
        position: absolute;
        top: 0;
        left: -100%;
        width: 100%;
        height: 100%;
        background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
        animation: shine 0.5s;
        pointer-events: none;
    `;
    card.querySelector('.card-back')?.appendChild(shine);
    setTimeout(() => shine.remove(), 500);
    
    if (State.collectedCards === CONFIG.TOTAL_CARDS) {
        setTimeout(() => {
            showModal();
        }, 800);
    }
}

function updateProgress() {
    if (DOM.collectedCount) {
        DOM.collectedCount.textContent = State.collectedCards;
    }
    if (DOM.progressFill) {
        DOM.progressFill.style.width = `${(State.collectedCards / CONFIG.TOTAL_CARDS) * 100}%`;
    }
}

// ==================== 许愿灯 ====================
function showWish(wishNum) {
    if (!DOM.wishDisplay) return;
    
    const wish = CONFIG.WISHES[wishNum - 1];
    if (!wish) return;
    
    DOM.wishDisplay.innerHTML = `<span class="wish-text">${wish}</span>`;
    playTone(783.99, 0.1, 0.3); // G5
}

// ==================== 抓动物游戏 ====================
function startCatchGame() {
    if (State.catchGameActive) return;
    
    State.catchScore = 0;
    State.catchGameActive = true;
    State.catchTimeLeft = CONFIG.GAME_DURATION;
    
    updateCatchStats();
    
    // 清除旧动物
    DOM.catchArea?.querySelectorAll('.running-animal').forEach(el => el.remove());
    
    // 倒计时
    const timer = setInterval(() => {
        State.catchTimeLeft--;
        updateCatchStats();
        
        if (State.catchTimeLeft <= 0) {
            clearInterval(timer);
            endCatchGame();
        }
    }, 1000);
    
    // 生成动物
    spawnAnimal();
}

function spawnAnimal() {
    if (!State.catchGameActive || !DOM.catchArea) return;
    
    const animal = document.createElement('div');
    animal.className = 'running-animal';
    animal.textContent = CONFIG.ANIMALS[Math.floor(Math.random() * CONFIG.ANIMALS.length)];
    
    const topPos = 40 + Math.random() * 50;
    animal.style.top = `${topPos}%`;
    animal.style.animationDuration = `${2 + Math.random() * 2}s`;
    
    animal.addEventListener('click', (e) => {
        e.stopPropagation();
        if (!State.catchGameActive) return;
        
        State.catchScore++;
        updateCatchStats();
        animal.remove();
        
        playTone(1046.5, 0.1, 0.1); // C6
        showFloatingText(e.clientX, e.clientY, '+1');
    });
    
    DOM.catchArea.appendChild(animal);
    
    setTimeout(() => animal.remove(), 4000);
    
    if (State.catchGameActive) {
        setTimeout(spawnAnimal, 600 + Math.random() * 800);
    }
}

function updateCatchStats() {
    if (DOM.catchScore) DOM.catchScore.textContent = State.catchScore;
    if (DOM.catchTime) DOM.catchTime.textContent = State.catchTimeLeft;
}

function endCatchGame() {
    State.catchGameActive = false;
    
    let message = '继续加油！💪';
    if (State.catchScore >= 20) message = '太厉害了！🏆';
    else if (State.catchScore >= 15) message = '反应神速！👏';
    else if (State.catchScore >= 10) message = '很不错哦！😄';
    else if (State.catchScore >= 5) message = '还可以！💪';
    
    showToast(`抓到 ${State.catchScore} 只！${message}`);
}

// ==================== 猜数字 ====================
function guessNumber() {
    if (!DOM.guessInput || !DOM.guessHint) return;
    
    const guess = parseInt(DOM.guessInput.value);
    
    if (isNaN(guess) || guess < 1 || guess > 10) {
        DOM.guessHint.textContent = '请输入 1-10 的数字';
        DOM.guessHint.style.color = '#e74c3c';
        return;
    }
    
    if (guess === State.secretNumber) {
        DOM.guessHint.textContent = '🎉 恭喜你猜对了！';
        DOM.guessHint.style.color = '#2ecc71';
        playTone(523.25, 0.2, 0.3);
        
        setTimeout(() => {
            State.secretNumber = Math.floor(Math.random() * 10) + 1;
            DOM.guessInput.value = '';
            DOM.guessHint.textContent = '再试一次？';
            DOM.guessHint.style.color = '';
        }, 2000);
    } else if (guess < State.secretNumber) {
        DOM.guessHint.textContent = '📈 太小了，再大一点';
        DOM.guessHint.style.color = '#f39c12';
        playTone(200, 0.1, 0.2);
    } else {
        DOM.guessHint.textContent = '📉 太大了，再小一点';
        DOM.guessHint.style.color = '#f39c12';
        playTone(200, 0.1, 0.2);
    }
}

// ==================== 表情包 ====================
function generateEmoji() {
    if (!DOM.emojiDisplay) return;
    
    const pack = CONFIG.EMOJI_PACKS[Math.floor(Math.random() * CONFIG.EMOJI_PACKS.length)];
    
    DOM.emojiDisplay.innerHTML = `
        <span class="emoji-big">${pack.emoji}</span>
        <p class="emoji-text">${pack.text}</p>
    `;
    
    playTone(659.25, 0.1, 0.2);
}

async function shareEmoji() {
    const bigEmoji = DOM.emojiDisplay?.querySelector('.emoji-big')?.textContent || '🎊';
    const text = DOM.emojiDisplay?.querySelector('.emoji-text')?.textContent || '新年快乐！';
    
    try {
        if (navigator.share) {
            await navigator.share({
                title: '新年祝福',
                text: `${bigEmoji} ${text}`
            });
        } else {
            await navigator.clipboard.writeText(`${bigEmoji} ${text}`);
            showToast('已复制到剪贴板！');
        }
    } catch (err) {
        showToast('分享失败，请手动截图~');
    }
}

// ==================== 烟花 ====================
function launchFireworks() {
    if (!DOM.fireworkCanvas) return;
    
    const canvas = DOM.fireworkCanvas;
    const ctx = canvas.getContext('2d');
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    
    const fireworks = [];
    const particles = [];
    
    class Firework {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = canvas.height;
            this.targetY = Math.random() * canvas.height * 0.4 + 50;
            this.speed = 4;
            this.color = CONFIG.COLORS[Math.floor(Math.random() * CONFIG.COLORS.length)];
        }
        
        update() {
            this.y -= this.speed;
            this.speed *= 0.98;
            return this.y > this.targetY;
        }
        
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, 3, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }
    
    class Particle {
        constructor(x, y, color) {
            this.x = x;
            this.y = y;
            this.color = color;
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 4 + 2;
            this.vx = Math.cos(angle) * speed;
            this.vy = Math.sin(angle) * speed;
            this.alpha = 1;
            this.decay = 0.015;
        }
        
        update() {
            this.vy += 0.1;
            this.x += this.vx;
            this.y += this.vy;
            this.alpha -= this.decay;
            return this.alpha > 0;
        }
        
        draw() {
            ctx.save();
            ctx.globalAlpha = this.alpha;
            ctx.beginPath();
            ctx.arc(this.x, this.y, 2, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
            ctx.restore();
        }
    }
    
    let animationId;
    function animate() {
        ctx.fillStyle = 'rgba(15, 15, 35, 0.1)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        for (let i = fireworks.length - 1; i >= 0; i--) {
            fireworks[i].draw();
            if (!fireworks[i].update()) {
                for (let j = 0; j < 30; j++) {
                    particles.push(new Particle(fireworks[i].x, fireworks[i].y, fireworks[i].color));
                }
                fireworks.splice(i, 1);
            }
        }
        
        for (let i = particles.length - 1; i >= 0; i--) {
            particles[i].draw();
            if (!particles[i].update()) {
                particles.splice(i, 1);
            }
        }
        
        if (fireworks.length > 0 || particles.length > 0) {
            animationId = requestAnimationFrame(animate);
        } else {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }
    
    // 发射多个烟花
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            fireworks.push(new Firework());
            if (i === 0) animate();
        }, i * 300);
    }
    
    playTone(523.25, 0.1, 0.2);
}

// ==================== 弹窗 ====================
function showModal() {
    DOM.completeModal?.classList.add('active');
    launchFireworks();
}

function closeModal() {
    DOM.completeModal?.classList.remove('active');
}

// ==================== Toast ====================
function showToast(message) {
    if (!DOM.toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    
    DOM.toastContainer.appendChild(toast);
    
    setTimeout(() => toast.remove(), 3000);
}

// ==================== 浮动文字 ====================
function showFloatingText(x, y, text) {
    const el = document.createElement('div');
    el.textContent = text;
    el.style.cssText = `
        position: fixed;
        left: ${x}px;
        top: ${y}px;
        color: #2ecc71;
        font-size: 1.5rem;
        font-weight: bold;
        pointer-events: none;
        z-index: 10000;
        animation: floatUp 0.8s ease-out forwards;
    `;
    
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 800);
}

// 添加动画
const style = document.createElement('style');
style.textContent = `
    @keyframes floatUp {
        0% { opacity: 1; transform: translateY(0) scale(1); }
        100% { opacity: 0; transform: translateY(-50px) scale(1.5); }
    }
    @keyframes shine {
        from { left: -100%; }
        to { left: 100%; }
    }
`;
document.head.appendChild(style);

// ==================== 音效 ====================
function playTone(freq, volume, duration) {
    try {
        if (!State.audioContext) {
            State.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        }
        
        const ctx = State.audioContext;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        
        osc.connect(gain);
        gain.connect(ctx.destination);
        
        osc.frequency.value = freq;
        gain.gain.setValueAtTime(volume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + duration);
        
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + duration);
    } catch (err) {
        // 忽略音频错误
    }
}

// ==================== 滚动效果 ====================
function handleScroll() {
    const scrollY = window.scrollY;
    const intro = DOM.introScreen;
    
    if (intro && !intro.classList.contains('hidden')) {
        const opacity = 1 - scrollY / window.innerHeight;
        intro.style.opacity = Math.max(0, opacity);
    }
}

// ==================== 重新开始 ====================
function replay() {
    location.reload();
}

// ==================== 导出 ====================
window.App = {
    startExperience,
    toggleMusic,
    openCard,
    showWish,
    startCatchGame,
    guessNumber,
    generateEmoji,
    shareEmoji,
    launchFireworks,
    closeModal,
    replay
};
