// Playful Page Interactions
// Ink Ripple, Mouse Trail, Konami Code Easter Egg

const POETRY_LINE = '天与云与山与水，上下一白';
const TRAIL_CHARS = ['·', '。', '~', '✦', '。', '·'];

// ==============================
// 1. Ink Ripple - click anywhere
// ==============================
function createRipple(e) {
    const ripple = document.createElement('div');
    ripple.className = 'ripple-effect';
    
    const x = e.clientX;
    const y = e.clientY;
    
    ripple.style.left = (x - 30) + 'px';
    ripple.style.top = (y - 30) + 'px';
    
    document.body.appendChild(ripple);
    requestAnimationFrame(() => ripple.classList.add('active'));
    setTimeout(() => ripple.remove(), 800);
}

// ==============================
// 2. Mouse Trail - subtle dots
// ==============================
function spawnTrailDot(x, y) {
    const dot = document.createElement('div');
    dot.className = 'trail-dot';
    dot.textContent = TRAIL_CHARS[Math.floor(Math.random() * TRAIL_CHARS.length)];
    dot.style.left = x + 'px';
    dot.style.top = y + 'px';
    dot.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#a1a1aa';
    
    document.body.appendChild(dot);
    requestAnimationFrame(() => dot.classList.add('active'));
    setTimeout(() => dot.remove(), 1200);
}

let trailTimer = null;
let trailEnabled = false;

function toggleTrail() {
    trailEnabled = !trailEnabled;
    const btn = document.getElementById('toggleEffects');
    if (btn) {
        btn.classList.toggle('active');
        btn.title = trailEnabled ? '关闭特效' : '开启特效';
    }
    if (trailEnabled && !trailTimer) {
        trailTimer = setInterval(() => { trailEnabled = false; trailTimer = null; }, 30000); // auto-off after 30s
    } else if (!trailEnabled && trailTimer) {
        clearInterval(trailTimer);
        trailTimer = null;
    }
}

// ==============================
// 3. Konami Code Easter Egg
// ==============================
const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
let konamiIndex = 0;

function triggerKonami() {
    // Create floating poetry characters
    const chars = POETRY_LINE.split('');
    chars.forEach((char, i) => {
        setTimeout(() => {
            const el = document.createElement('div');
            el.className = 'konami-char';
            el.textContent = char;
            el.style.left = (window.innerWidth / 2 - 100 + Math.random() * 200) + 'px';
            el.style.top = '-50px';
            el.style.color = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#18181b';
            document.body.appendChild(el);
            requestAnimationFrame(() => el.classList.add('active'));
            setTimeout(() => el.remove(), 5000);
        }, i * 150);
    });
    
    // Show toast
    const toast = document.createElement('div');
    toast.className = 'achievement-toast show';
    toast.style.pointerEvents = 'none';
    toast.innerHTML = '<div style="font-size:1.5rem;">✨</div><div><div style="font-weight:700;">湖心亭看雪 · 密语解锁</div><div style="font-size:0.85rem;color:var(--text-muted);">' + POETRY_LINE + '</div></div>';
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; setTimeout(() => toast.remove(), 500); }, 3000);
}

// ==============================
// Init
// ==============================
function initPlayground() {
    const isTouch = 'ontouchstart' in window;
    
    // Add toggle button
    const header = document.querySelector('.header-inner');
    if (header && !document.getElementById('toggleEffects')) {
        const btn = document.createElement('button');
        btn.id = 'toggleEffects';
        btn.className = 'theme-toggle';
        btn.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2z"></path></svg>';
        btn.title = '开启特效';
        btn.setAttribute('aria-label', 'Toggle Interactive Effects');
        btn.addEventListener('click', toggleTrail);
        header.appendChild(btn);
    }
    
    // Click ripple (non-touch only for performance)
    if (!isTouch) {
        document.addEventListener('click', (e) => {
            // Don't ripple on interactive elements
            const tag = e.target.tagName;
            if (tag === 'A' || tag === 'BUTTON' || tag === 'INPUT' || tag === 'TEXTAREA') return;
            if (e.target.closest('a, button, input, textarea, .post-card, .btn, .palette-panel')) return;
            createRipple(e);
        });
    }
    
    // Mouse trail
    if (!isTouch) {
        document.addEventListener('mousemove', (e) => {
            if (!trailEnabled) return;
            if (Math.random() > 0.3) return; // 30% chance to reduce density
            spawnTrailDot(e.clientX, e.clientY);
        });
    }
    
    // Konami code
    document.addEventListener('keydown', (e) => {
        const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
        const expected = KONAMI[konamiIndex];
        
        if (key === expected || (expected === 'a' && key === 'a') || (expected === 'b' && key === 'b')) {
            konamiIndex++;
            if (konamiIndex === KONAMI.length) {
                konamiIndex = 0;
                triggerKonami();
            }
        } else {
            konamiIndex = 0;
        }
    });
}

export { initPlayground };
