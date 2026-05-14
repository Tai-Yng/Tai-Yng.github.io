// Color Palette Module
const PRESET_COLORS = [
    '#2563eb', '#7c3aed', '#db2777', '#dc2626',
    '#ea580c', '#ca8a04', '#16a34a', '#0d9488',
    '#0891b2', '#18181b',
];

const STORAGE_KEY = 'kopi_accent_color';
const DARK_STORAGE_KEY = 'kopi_accent_color_dark';
const DEFAULT_ACCENT = '#2563eb';
const DEFAULT_ACCENT_DARK = '#60a5fa';

function hexToHSL(hex) {
    let r = parseInt(hex.slice(1, 3), 16) / 255;
    let g = parseInt(hex.slice(3, 5), 16) / 255;
    let b = parseInt(hex.slice(5, 7), 16) / 255;
    let max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    if (max === min) { h = s = 0; } else {
        let d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = ((g - b) / d + (g < b ? 6 : 0)) / 6; break;
            case g: h = ((b - r) / d + 2) / 6; break;
            case b: h = ((r - g) / d + 4) / 6; break;
        }
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function hslToHex(h, s, l) {
    s /= 100; l /= 100;
    const a = s * Math.min(l, 1 - l);
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return '#' + f(0) + f(8) + f(4);
}

function getLighterShade(hex) {
    const hsl = hexToHSL(hex);
    return hslToHex(hsl.h, hsl.s, Math.min(hsl.l + 15, 95));
}

function applyAccentColor(color) {
    const root = document.documentElement;
    root.style.setProperty('--accent', color);
    root.style.setProperty('--accent-light', getLighterShade(color));
}

function initPalette() {
    const toggle = document.getElementById('paletteToggle');
    const panel = document.getElementById('palettePanel');
    const colorsContainer = document.getElementById('paletteColors');
    const customInput = document.getElementById('customColorInput');
    const resetBtn = document.getElementById('paletteReset');
    
    if (!toggle || !panel) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const key = isDark ? DARK_STORAGE_KEY : STORAGE_KEY;
    const currentColor = localStorage.getItem(key) || (isDark ? DEFAULT_ACCENT_DARK : DEFAULT_ACCENT);
    
    // Generate color swatches
    colorsContainer.innerHTML = PRESET_COLORS.map(color => {
        const isActive = color.toLowerCase() === currentColor.toLowerCase();
        return '<button class="palette-color ' + (isActive ? 'active' : '') + '" ' +
               'data-color="' + color + '" style="background-color: ' + color + '" ' +
               'title="' + color + '" aria-label="Set accent color to ' + color + '"></button>';
    }).join('');
    
    if (customInput) customInput.value = currentColor;
    
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });
    
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
    
    colorsContainer.addEventListener('click', (e) => {
        const colorBtn = e.target.closest('.palette-color');
        if (colorBtn) {
            const color = colorBtn.dataset.color;
            colorsContainer.querySelectorAll('.palette-color').forEach(btn => btn.classList.remove('active'));
            colorBtn.classList.add('active');
            applyAccentColor(color);
            localStorage.setItem(key, color);
            if (customInput) customInput.value = color;
        }
    });
    
    if (customInput) {
        customInput.addEventListener('input', (e) => {
            const color = e.target.value;
            colorsContainer.querySelectorAll('.palette-color').forEach(btn => btn.classList.remove('active'));
            applyAccentColor(color);
            localStorage.setItem(key, color);
        });
    }
    
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const defaultColor = isDark ? DEFAULT_ACCENT_DARK : DEFAULT_ACCENT;
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(DARK_STORAGE_KEY);
            document.documentElement.style.setProperty('--accent', defaultColor);
            colorsContainer.querySelectorAll('.palette-color').forEach(btn => {
                btn.classList.toggle('active', btn.dataset.color.toLowerCase() === defaultColor.toLowerCase());
            });
            if (customInput) customInput.value = defaultColor;
        });
    }
    
    applyAccentColor(currentColor);
}

export { initPalette };
