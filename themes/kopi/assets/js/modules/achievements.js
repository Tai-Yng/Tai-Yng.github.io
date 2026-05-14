// Reading Achievements System
const ACHIEVEMENTS = {
    first_visit:     { id: 'first_visit',     name: '初来乍到',   desc: '首次访问博客',          icon: '🏠',  color: '#a1a1aa' },
    first_article:   { id: 'first_article',   name: '一阅倾心',   desc: '阅读了第一篇文章',      icon: '📖',  color: '#6366f1' },
    read_5:          { id: 'read_5',          name: '书虫',       desc: '阅读了 5 篇文章',       icon: '📚',  color: '#8b5cf6' },
    read_20:         { id: 'read_20',         name: '博览群书',   desc: '阅读了 20 篇文章',      icon: '📚',  color: '#a855f7' },
    read_50:         { id: 'read_50',         name: '阅读大师',   desc: '阅读了 50 篇文章',      icon: '🏆',  color: '#f59e0b' },
    night_reader:    { id: 'night_reader',    name: '夜读人',     desc: '在深夜阅读文章',        icon: '🌙',  color: '#3b82f6' },
    dawn_reader:     { id: 'dawn_reader',     name: '晨读者',     desc: '在清晨阅读文章',        icon: '☀️',  color: '#f97316' },
    midnight_explorer: { id: 'midnight_explorer', name: '深夜探索者', desc: '在午夜时分阅读',  icon: '🦉',  color: '#1e293b' },
    tag_collector:   { id: 'tag_collector',   name: '标签收集者', desc: '浏览过 3 个不同标签',   icon: '🏷️',  color: '#10b981' },
    tag_master:      { id: 'tag_master',      name: '标签大师',   desc: '浏览过 10 个不同标签',  icon: '🎯',  color: '#059669' },
    streak_3:        { id: 'streak_3',        name: '热情读者',   desc: '连续 3 天访问',         icon: '🔥',  color: '#f97316' },
    streak_7:        { id: 'streak_7',        name: '忠实读者',   desc: '连续 7 天访问',         icon: '🔥',  color: '#ea580c' },
    streak_30:       { id: 'streak_30',       name: '铁杆粉丝',   desc: '连续 30 天访问',        icon: '💎',  color: '#7c3aed' },
    day_runner:      { id: 'day_runner',      name: '一日十篇',   desc: '一天内阅读 10 篇文章',  icon: '⚡',  color: '#eab308' },
};

const STORAGE_KEY = 'kopi_achievements';

function getDefaultData() {
    return {
        articlesRead: [],        // URLs of read articles
        totalRead: 0,
        tagsVisited: [],         // Tag names visited
        lastVisitDate: '',
        consecutiveDays: 0,
        dailyCount: 0,
        dailyDate: '',
        unlocked: [],            // Achievement IDs unlocked
        firstVisitDone: false,
    };
}

function loadData() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) return { ...getDefaultData(), ...JSON.parse(raw) };
    } catch(e) {}
    return getDefaultData();
}

function saveData(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function checkAndUnlock(data, achievementId) {
    if (data.unlocked.includes(achievementId)) return false;
    data.unlocked.push(achievementId);
    return true;
}

function showAchievementToast(achievement) {
    const toast = document.createElement('div');
    toast.className = 'achievement-toast';
    toast.innerHTML = `
        <div class="achievement-toast-icon">${achievement.icon}</div>
        <div class="achievement-toast-content">
            <div class="achievement-toast-title">🏅 解锁成就</div>
            <div class="achievement-toast-name">${achievement.name}</div>
            <div class="achievement-toast-desc">${achievement.desc}</div>
        </div>
    `;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add('show'));
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 400);
    }, 3500);
}

function renderAchievements(data) {
    const container = document.getElementById('achievementsWidget');
    if (!container) return;

    const unlockedCount = data.unlocked.length;
    const totalCount = Object.keys(ACHIEVEMENTS).length;

    container.innerHTML = `
        <div class="widget-title">成就 · ${unlockedCount}/${totalCount}</div>
        <div class="achievements-grid">
            ${Object.values(ACHIEVEMENTS).map(a => {
                const unlocked = data.unlocked.includes(a.id);
                return `<div class="achievement-badge ${unlocked ? 'unlocked' : 'locked'}" 
                            style="${unlocked ? `border-color: ${a.color};` : ''}"
                            title="${unlocked ? a.name + ': ' + a.desc : '???'}">
                    <span class="achievement-icon">${unlocked ? a.icon : '🔒'}</span>
                    <span class="achievement-label">${unlocked ? a.name : '???'}</span>
                </div>`;
            }).join('')}
        </div>
    `;
}

function updateDailyStreak(data) {
    const today = new Date().toISOString().split('T')[0];
    if (data.dailyDate === today) {
        data.dailyCount++;
    } else {
        // Check if yesterday
        const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
        if (data.lastVisitDate === yesterday) {
            data.consecutiveDays++;
        } else if (data.lastVisitDate !== today) {
            data.consecutiveDays = 1;
        }
        data.dailyDate = today;
        data.dailyCount = 1;
    }
    data.lastVisitDate = today;
}

function recordArticleRead(url, tags) {
    const data = loadData();
    
    // First visit
    if (!data.firstVisitDone) {
        data.firstVisitDone = true;
        if (checkAndUnlock(data, 'first_visit')) {
            showAchievementToast(ACHIEVEMENTS.first_visit);
        }
    }
    
    // Track article
    if (!data.articlesRead.includes(url)) {
        data.articlesRead.push(url);
        data.totalRead = data.articlesRead.length;
        
        // First article
        if (data.totalRead === 1) {
            checkAndUnlock(data, 'first_article');
            showAchievementToast(ACHIEVEMENTS.first_article);
        }
    }
    
    // Reading milestones
    const readCount = data.totalRead;
    if (readCount >= 5 && checkAndUnlock(data, 'read_5')) showAchievementToast(ACHIEVEMENTS.read_5);
    if (readCount >= 20 && checkAndUnlock(data, 'read_20')) showAchievementToast(ACHIEVEMENTS.read_20);
    if (readCount >= 50 && checkAndUnlock(data, 'read_50')) showAchievementToast(ACHIEVEMENTS.read_50);
    
    // Time-based achievements
    const hour = new Date().getHours();
    if (hour >= 22 || hour < 5) {
        if (checkAndUnlock(data, 'night_reader')) showAchievementToast(ACHIEVEMENTS.night_reader);
        if (hour >= 0 && hour < 3) {
            if (checkAndUnlock(data, 'midnight_explorer')) showAchievementToast(ACHIEVEMENTS.midnight_explorer);
        }
    }
    if (hour >= 5 && hour < 8) {
        if (checkAndUnlock(data, 'dawn_reader')) showAchievementToast(ACHIEVEMENTS.dawn_reader);
    }
    
    // Tags
    if (tags && tags.length) {
        tags.forEach(t => {
            if (!data.tagsVisited.includes(t)) data.tagsVisited.push(t);
        });
        if (data.tagsVisited.length >= 3 && checkAndUnlock(data, 'tag_collector')) showAchievementToast(ACHIEVEMENTS.tag_collector);
        if (data.tagsVisited.length >= 10 && checkAndUnlock(data, 'tag_master')) showAchievementToast(ACHIEVEMENTS.tag_master);
    }
    
    // Daily streak
    updateDailyStreak(data);
    if (data.consecutiveDays >= 3 && checkAndUnlock(data, 'streak_3')) showAchievementToast(ACHIEVEMENTS.streak_3);
    if (data.consecutiveDays >= 7 && checkAndUnlock(data, 'streak_7')) showAchievementToast(ACHIEVEMENTS.streak_7);
    if (data.consecutiveDays >= 30 && checkAndUnlock(data, 'streak_30')) showAchievementToast(ACHIEVEMENTS.streak_30);
    
    // Daily count
    if (data.dailyCount >= 10 && checkAndUnlock(data, 'day_runner')) showAchievementToast(ACHIEVEMENTS.day_runner);
    
    saveData(data);
    renderAchievements(data);
}

function initAchievements() {
    const data = loadData();
    renderAchievements(data);
    
    // Check if on an article page
    const articleBody = document.querySelector('.article-body');
    if (articleBody) {
        const metaTag = document.querySelector('[data-page-tags]');
        const tags = metaTag ? metaTag.getAttribute('data-page-tags').split(',') : [];
        recordArticleRead(window.location.pathname, tags);
    }
}

export { initAchievements, renderAchievements };
