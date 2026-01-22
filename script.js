let currentSection = 1;
const totalSections = 5;
let musicPlaying = false;

// 音乐控制
function toggleMusic() {
    const music = document.getElementById('bgMusic');
    const musicControl = document.getElementById('musicControl');
    const musicIcon = document.getElementById('musicIcon');
    const musicText = document.getElementById('musicText');

    if (musicPlaying) {
        music.pause();
        musicIcon.textContent = '🔇';
        musicText.textContent = '点击播放音乐';
        musicControl.classList.remove('playing');
        musicPlaying = false;
    } else {
        music.play().catch(err => {
            console.log('音乐播放失败:', err);
        });
        musicIcon.textContent = '🎵';
        musicText.textContent = '音乐播放中';
        musicControl.classList.add('playing');
        musicPlaying = true;
    }
}

// 页面加载时尝试自动播放（某些浏览器可能会阻止）
window.addEventListener('load', () => {
    const music = document.getElementById('bgMusic');
    music.volume = 0.3; // 设置音量为30%

    // 尝试自动播放
    music.play().then(() => {
        musicPlaying = true;
        document.getElementById('musicIcon').textContent = '🎵';
        document.getElementById('musicText').textContent = '音乐播放中';
        document.getElementById('musicControl').classList.add('playing');
    }).catch(() => {
        // 如果自动播放被阻止，保持默认状态
        console.log('自动播放被阻止，请手动点击播放');
    });
});


function nextSection() {
    if (currentSection < totalSections) {
        // 隐藏当前section
        document.getElementById(`section${currentSection}`).classList.remove('active');
        
        // 更新进度点
        document.querySelectorAll('.dot')[currentSection - 1].classList.remove('active');
        
        // 显示下一个section
        currentSection++;
        document.getElementById(`section${currentSection}`).classList.add('active');
        document.querySelectorAll('.dot')[currentSection - 1].classList.add('active');
    }
}

// 点击进度点跳转
document.querySelectorAll('.dot').forEach((dot, index) => {
    dot.addEventListener('click', () => {
        document.getElementById(`section${currentSection}`).classList.remove('active');
        document.querySelectorAll('.dot')[currentSection - 1].classList.remove('active');
        
        currentSection = index + 1;
        document.getElementById(`section${currentSection}`).classList.add('active');
        document.querySelectorAll('.dot')[currentSection - 1].classList.add('active');
    });
});

// "再想想"按钮躲避效果
function moveButton() {
    const noBtn = document.getElementById('noBtn');
    const maxX = window.innerWidth - noBtn.offsetWidth - 100;
    const maxY = window.innerHeight - noBtn.offsetHeight - 100;
    
    const randomX = Math.floor(Math.random() * maxX);
    const randomY = Math.floor(Math.random() * maxY);
    
    noBtn.style.position = 'fixed';
    noBtn.style.left = randomX + 'px';
    noBtn.style.top = randomY + 'px';
    noBtn.style.transition = 'all 0.3s ease';
}

// 点击"好呀"
function handleYes() {
    document.getElementById('section5').classList.remove('active');
    document.getElementById('success').classList.add('active');
    createFireworks();

    // 切换到更欢快的音乐（如果需要）
    const music = document.getElementById('bgMusic');
    music.volume = 0.5; // 增加音量
}

// 点击"再想想"
function handleNo() {
    alert('再考虑考虑嘛~ 我会一直等你的 💕');
}

// 创建烟花效果
function createFireworks() {
    const fireworksContainer = document.querySelector('.fireworks');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#6c5ce7'];
    
    for (let i = 0; i < 50; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.style.position = 'absolute';
            firework.style.width = '10px';
            firework.style.height = '10px';
            firework.style.borderRadius = '50%';
            firework.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            firework.style.left = Math.random() * 100 + '%';
            firework.style.top = Math.random() * 100 + '%';
            firework.style.animation = 'fireworkFade 2s ease-out forwards';
            
            fireworksContainer.appendChild(firework);
            
            setTimeout(() => {
                firework.remove();
            }, 2000);
        }, i * 100);
    }
}

// 添加烟花动画CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes fireworkFade {
        0% {
            transform: scale(0) translateY(0);
            opacity: 1;
        }
        50% {
            transform: scale(2) translateY(-50px);
            opacity: 0.8;
        }
        100% {
            transform: scale(0) translateY(-100px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// 键盘导航
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (currentSection < totalSections) {
            nextSection();
        }
    } else if (e.key === 'ArrowLeft') {
        if (currentSection > 1) {
            document.getElementById(`section${currentSection}`).classList.remove('active');
            document.querySelectorAll('.dot')[currentSection - 1].classList.remove('active');
            
            currentSection--;
            document.getElementById(`section${currentSection}`).classList.add('active');
            document.querySelectorAll('.dot')[currentSection - 1].classList.add('active');
        }
    }
});

// 添加心形飘落效果（可选）
function createFloatingHearts() {
    const heart = document.createElement('div');
    heart.innerHTML = '💕';
    heart.style.position = 'fixed';
    heart.style.left = Math.random() * 100 + '%';
    heart.style.top = '-50px';
    heart.style.fontSize = Math.random() * 20 + 20 + 'px';
    heart.style.opacity = Math.random() * 0.5 + 0.5;
    heart.style.animation = 'floatDown 5s linear';
    heart.style.pointerEvents = 'none';
    heart.style.zIndex = '1000';
    
    document.body.appendChild(heart);
    
    setTimeout(() => {
        heart.remove();
    }, 5000);
}

// 定期创建飘落的心形
setInterval(createFloatingHearts, 2000);

// 添加飘落动画
const floatStyle = document.createElement('style');
floatStyle.textContent = `
    @keyframes floatDown {
        0% {
            transform: translateY(0) rotate(0deg);
        }
        100% {
            transform: translateY(100vh) rotate(360deg);
        }
    }
`;
document.head.appendChild(floatStyle);

