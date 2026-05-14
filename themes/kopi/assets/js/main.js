import { initNavigation } from './modules/navigation.js';
import { initTheme } from './modules/theme.js';
import { initRadio } from './modules/radio.js';
import { initInteractions } from './modules/interactions.js';
import { initSearch } from './modules/search.js';
import { initPWA } from './modules/pwa.js';
import { initPrefetch } from './modules/prefetch.js';
import { initPalette } from './modules/palette.js';
import { initAchievements } from './modules/achievements.js';
import './external/turbo.es2017-umd.js';
import * as params from '@params';

document.addEventListener('turbo:load', () => {
    initNavigation();
    initTheme();
    initRadio(params.radioConfigPath);
    initInteractions();
    initSearch();
    initPWA(params.swPath, params.swScope);
    initPrefetch();
    initPalette();
    initAchievements();
});
