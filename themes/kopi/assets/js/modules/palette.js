// Color Palette Module

const PRESET_COLORS = [
    '#2563eb', // Blue (default)
    '#7c3aed', // Violet
    '#db2777', // Pink
    '#dc2626', // Red
    '#ea580c', // Orange
    '#ca8a04', // Yellow
    '#16a34a', // Green
    '#0d9488', // Teal
    '#0891b2', // Cyan
    '#18181b', // Black
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
    
    if (max === min) {
        h = s = 0;
    } else {
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
    s /= 100;
    l /= 100;
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

function applyAccentColor(color, isDark) {
    const root = document.documentElement;
    
    // Set CSS variable
    root.style.setProperty('--accent', color);
    
    // Calculate lighter shade for hover states
    const lighterShade = getLighterShade(color);
    root.style.setProperty('--accent-light', lighterShade);
    
    // Also update dark mode accent if needed
    if (isDark) {
        localStorage.setItem(DARK_STORAGE_KEY, color);
    } else {
        localStorage.setItem(STORAGE_KEY, color);
    }
}

function getCurrentAccent(isDark) {
    const key = isDark ? DARK_STORAGE_KEY : STORAGE_KEY;
    const stored = localStorage.getItem(key);
    return stored || (isDark ? DEFAULT_ACCENT_DARK : DEFAULT_ACCENT);
}

function initPalette() {
    const toggle = document.getElementById('paletteToggle');
    const panel = document.getElementById('palettePanel');
    const colorsContainer = document.getElementById('paletteColors');
    const customInput = document.getElementById('customColorInput');
    const resetBtn = document.getElementById('paletteReset');
    
    if (!toggle || !panel) return;
    
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const currentColor = getCurrentAccent(isDark);
    
    // Generate color swatches
    colorsContainer.innerHTML = PRESET_COLORS.map(color => {
        const isActive = color.toLowerCase() === currentColor.toLowerCase();
        return '<button class="palette-color ' + (isActive ? 'active' : '') + '" ' +
               'data-color="' + color + '" ' +
               'style="background-color: ' + color + '" ' +
               'title="' + color + '" ' +
               'aria-label="Set accent color to ' + color + '"></button>';
    }).join('');
    
    // Set custom input value
    if (customInput) {
        customInput.value = currentColor;
    }
    
    // Toggle panel
    toggle.addEventListener('click', (e) => {
        e.stopPropagation();
        panel.classList.toggle('active');
    });
    
    // Close panel on outside click
    document.addEventListener('click', (e) => {
        if (!panel.contains(e.target) && !toggle.contains(e.target)) {
            panel.classList.remove('active');
        }
    });
    
    // Handle preset color selection
    colorsContainer.addEventListener('click', (e) => {
        const colorBtn = e.target.closest('.palette-color');
        if (colorBtn) {
            const color = colorBtn.dataset.color;
            
            // Update active state
            colorsContainer.querySelectorAll('.palette-color').forEach(btn => {
                btn.classList.remove('active');
            });
            colorBtn.classList.add('active');
            
            // Apply color
            applyAccentColor(color, isDark);
            
            // Update custom input
            if (customInput) {
                customInput.value = color;
            }
            
            // Show toast
            showPaletteToast('Accent color changed to ' + color);
        }
    });
    
    // Handle custom color
    if (customInput) {
        customInput.addEventListener('input', (e) => {
            const color = e.target.value;
            
            // Remove active from presets
            colorsContainer.querySelectorAll('.palette-color').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Apply color
            applyAccentColor(color, isDark);
        });
    }
    
    // Handle reset
    if (resetBtn) {
        resetBtn.addEventListener('click', () => {
            const defaultColor = isDark ? DEFAULT_ACCENT_DARK : DEFAULT_ACCENT;
            
            // Remove stored value
            localStorage.removeItem(STORAGE_KEY);
            localStorage.removeItem(DARK_STORAGE_KEY);
            
            // Apply default
            document.documentElement.style.setProperty('--accent', defaultColor);
            
            // Update UI
            colorsContainer.querySelectorAll('.palette-color').forEach(btn => {
                btn.classList.toggle('active', 
                    btn.dataset.color.toLowerCase() === defaultColor.toLowerCase());
            });
            
            if (customInput) {
                customInput.value = defaultColor;
            }
            
            showPaletteToast('Accent color reset to default');
        });
    }
    
    // Apply stored color on load
    applyAccentColor(currentColor, isDark);
}

function showPaletteToast(message) {
    // Reuse the toast function from interactions
    if (typeof window.showToast === 'function') {
        window.showToast(message);
    } else {
        // Fallback toast
        const toast = document.createElement('div');
        toast.className = 'toast';
        toast.innerHTML = '<svg class="toast-icon" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg><span>' + message + '</span>';
        
        let container = document.getElementById('toastContainer');
        if (!container) {
            container = document.createElement('div');
            container.id = 'toastContainer';
            container.className = 'toast-container';
            document.body.appendChild(container);
        }
        
        container.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('show'));
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    }
}

// Re-apply accent color when theme changes
document.addEventListener('turbo:load', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const currentColor = getCurrentAccent(isDark);
    applyAccentColor(currentColor, isDark);
});

export { initPalette };
