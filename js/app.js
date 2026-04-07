/**
 * app.js - 主应用逻辑 (多页面版本)
 */

// 应用状态
const AppState = {
    currentScreen: 'home', // home, practice, library, profile, wrong
    config: null,
    currentCorpus: null,
    currentStage: 1,
    userTranslation: '',
    userBackTranslation: '',
    translationScore: 0,
    backScore: 0,
    stageStartTime: 0,
    questionStartTime: 0,
    isFavorite: false,
    retryCount: {
        translation: 0,
        backTranslation: 0
    },
    currentLibraryMode: 'all',
    wrongFilter: 'all'
};

// DOM 元素缓存
const DOM = {};

/**
 * 初始化应用
 */
function initApp() {
    cacheDOMElements();
    corpusManager.initialize();
    
    // 检查配置
    const savedConfig = ConfigStorage.load();
    if (savedConfig && savedConfig.isValid()) {
        AppState.config = savedConfig;
    }
    
    // 更新首页数据
    updateHomePage();
    
    // 绑定事件
    bindEvents();
    
    // 显示首页
    showScreen('home');
}

/**
 * 缓存DOM元素
 */
function cacheDOMElements() {
    // Screens
    DOM.screens = {
        home: document.getElementById('home-screen'),
        practice: document.getElementById('practice-screen'),
        library: document.getElementById('library-screen'),
        profile: document.getElementById('profile-screen'),
        wrong: document.getElementById('wrong-screen')
    };
    
    // Home
    DOM.configPreview = document.getElementById('config-preview');
    DOM.previewMbti = document.getElementById('preview-mbti');
    DOM.previewVocab = document.getElementById('preview-vocab');
    DOM.previewThreshold = document.getElementById('preview-threshold');
    DOM.wrongCount = document.getElementById('wrong-count');
    DOM.statTotalMini = document.getElementById('stat-total-mini');
    DOM.statAccuracyMini = document.getElementById('stat-accuracy-mini');
    DOM.statStreakMini = document.getElementById('stat-streak-mini');
    DOM.checkinText = document.getElementById('checkin-text');
    DOM.checkinBanner = document.getElementById('checkin-banner');
    
    // Practice
    DOM.sessionInfo = document.getElementById('session-info');
    DOM.progressFill = document.getElementById('progress-fill');
    DOM.currentQuestion = document.getElementById('current-question');
    DOM.thresholdBadge = document.getElementById('threshold-badge');
    
    DOM.stage1 = document.getElementById('stage-1');
    DOM.stage2 = document.getElementById('stage-2');
    DOM.originalText = document.getElementById('original-text');
    DOM.corpusDifficulty = document.getElementById('corpus-difficulty');
    DOM.corpusSource = document.getElementById('corpus-source');
    DOM.corpusTopic = document.getElementById('corpus-topic');
    
    DOM.translationInput = document.getElementById('translation-input');
    DOM.charCount = document.getElementById('char-count');
    DOM.submitTranslation = document.getElementById('submit-translation');
    
    DOM.referenceText = document.getElementById('reference-text');
    DOM.backTranslationInput = document.getElementById('back-translation-input');
    DOM.backCharCount = document.getElementById('back-char-count');
    DOM.submitBackTranslation = document.getElementById('submit-back-translation');
    
    DOM.feedbackPanel = document.getElementById('feedback-panel');
    DOM.confidenceCircle = document.getElementById('confidence-circle');
    DOM.confidenceText = document.getElementById('confidence-text');
    DOM.feedbackStatus = document.getElementById('feedback-status');
    DOM.diffContent = document.getElementById('diff-content');
    DOM.retryBtn = document.getElementById('retry-btn');
    DOM.hintBtn = document.getElementById('hint-btn');
    DOM.clearBtn = document.getElementById('clear-btn');
    
    DOM.completionPanel = document.getElementById('completion-panel');
    DOM.completionTime = document.getElementById('completion-time');
    DOM.completionTranslationScore = document.getElementById('completion-translation-score');
    DOM.completionBackScore = document.getElementById('completion-back-score');
    DOM.summaryContent = document.getElementById('summary-content');
    DOM.favoriteBtn = document.getElementById('favorite-btn');
    DOM.nextQuestionBtn = document.getElementById('next-question-btn');
    
    DOM.practiceTotal = document.getElementById('practice-total');
    DOM.practiceAvg = document.getElementById('practice-avg');
    
    // Library
    DOM.modeGrid = document.getElementById('mode-grid');
    DOM.corpusList = document.getElementById('corpus-list');
    DOM.importOriginal = document.getElementById('import-original');
    DOM.importTranslation = document.getElementById('import-translation');
    DOM.importDifficulty = document.getElementById('import-difficulty');
    DOM.importTopic = document.getElementById('import-topic');
    DOM.confirmImport = document.getElementById('confirm-import');
    
    // Profile
    DOM.userMbti = document.getElementById('user-mbti');
    DOM.userVocab = document.getElementById('user-vocab');
    DOM.statTotal = document.getElementById('stat-total');
    DOM.statAccuracy = document.getElementById('stat-accuracy');
    DOM.statStreak = document.getElementById('stat-streak');
    DOM.statTime = document.getElementById('stat-time');
    DOM.calendarGrid = document.getElementById('calendar-grid');
    DOM.favoritesCount = document.getElementById('favorites-count');
    DOM.wrongTotalCount = document.getElementById('wrong-total-count');
    
    // Wrong
    DOM.wrongList = document.getElementById('wrong-list');
    DOM.wrongTabs = document.querySelectorAll('.wrong-tabs .tab-btn');
    
    // Modals
    DOM.configModal = document.getElementById('config-modal');
    DOM.settingsModal = document.getElementById('settings-modal');
    DOM.mbtiGrid = document.getElementById('mbti-grid');
    DOM.thresholdSlider = document.getElementById('threshold-slider');
    DOM.thresholdValue = document.getElementById('threshold-value');
    
    DOM.llmProvider = document.getElementById('llm-provider');
    DOM.llmApiKey = document.getElementById('llm-api-key');
    DOM.dailyGoal = document.getElementById('daily-goal');
    
    // Toast
    DOM.toast = document.getElementById('toast');
}

/**
 * 更新首页
 */
function updateHomePage() {
    // 更新配置预览
    if (AppState.config) {
        DOM.previewMbti.textContent = AppState.config.mbti || '未设置';
        DOM.previewVocab.textContent = AppState.config.vocabulary ? `${AppState.config.vocabulary} 词` : '未设置';
        DOM.previewThreshold.textContent = `${AppState.config.threshold || 90}%`;
    } else {
        DOM.previewMbti.textContent = '未设置';
        DOM.previewVocab.textContent = '未设置';
        DOM.previewThreshold.textContent = '90%';
    }
    
    // 更新统计数据
    const stats = StatsCalculator.calculate();
    DOM.statTotalMini.textContent = stats.totalCount;
    DOM.statAccuracyMini.textContent = `${stats.avgTotalScore}%`;
    DOM.statStreakMini.textContent = stats.streakDays;
    
    // 更新错题数
    const wrongCount = RecordStorage.getWrongCount();
    DOM.wrongCount.textContent = `${wrongCount} 题`;
    
    // 更新打卡状态
    updateCheckinStatus();
}

/**
 * 更新打卡状态
 */
function updateCheckinStatus() {
    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem('last_checkin_date');
    const checkinDates = JSON.parse(localStorage.getItem('checkin_dates') || '[]');
    
    if (lastCheckin === today) {
        DOM.checkinBanner.classList.add('checked');
        DOM.checkinText.textContent = `✅ 今日已打卡，连续 ${checkinDates.length} 天`;
        document.getElementById('btn-checkin').textContent = '已打卡';
        document.getElementById('btn-checkin').disabled = true;
    } else {
        DOM.checkinBanner.classList.remove('checked');
        DOM.checkinText.textContent = '今日还未打卡';
        document.getElementById('btn-checkin').textContent = '立即打卡';
        document.getElementById('btn-checkin').disabled = false;
    }
}

/**
 * 打卡
 */
function doCheckin() {
    const today = new Date().toDateString();
    const lastCheckin = localStorage.getItem('last_checkin_date');
    const checkinDates = JSON.parse(localStorage.getItem('checkin_dates') || '[]');
    
    if (lastCheckin !== today) {
        // 检查是否连续
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        if (lastCheckin === yesterday.toDateString()) {
            // 连续
        } else if (lastCheckin) {
            // 重置连续天数
            checkinDates.length = 0;
        }
        
        checkinDates.push(today);
        localStorage.setItem('checkin_dates', JSON.stringify(checkinDates));
        localStorage.setItem('last_checkin_date', today);
        
        showToast('打卡成功！');
        updateCheckinStatus();
        updateHomePage();
    }
}

/**
 * 显示指定屏幕
 */
function showScreen(screen) {
    Object.values(DOM.screens).forEach(s => s.classList.remove('active'));
    
    if (DOM.screens[screen]) {
        DOM.screens[screen].classList.add('active');
    }
    
    AppState.currentScreen = screen;
    
    // 页面特定初始化
    if (screen === 'library') {
        initLibraryPage();
    } else if (screen === 'profile') {
        initProfilePage();
    } else if (screen === 'wrong') {
        initWrongPage();
    }
}

/**
 * 初始化题库页面
 */
function initLibraryPage() {
    // 更新题库计数
    const allCorpus = corpusManager.getAllCorpus();
    document.getElementById('count-all').textContent = `${allCorpus.length}题`;
    
    const topics = ['daily', 'business', 'academic', 'tech'];
    topics.forEach(topic => {
        const count = allCorpus.filter(c => c.topic === topic).length;
        const el = document.getElementById(`count-${topic}`);
        if (el) el.textContent = `${count}题`;
    });
    
    // 渲染语料列表
    renderCorpusList('all');
}

/**
 * 渲染语料列表
 */
function renderCorpusList(mode) {
    let corpusList;
    if (mode === 'all') {
        corpusList = corpusManager.getAllCorpus();
    } else {
        corpusList = corpusManager.getCorpusByTopic(mode);
    }
    
    if (corpusList.length === 0) {
        DOM.corpusList.innerHTML = '<p class="empty-state">暂无语料</p>';
        return;
    }
    
    DOM.corpusList.innerHTML = corpusList.map(corpus => `
        <div class="corpus-item" data-id="${corpus.id}">
            <div class="corpus-item-header">
                <span class="corpus-difficulty ${corpus.difficulty}">${corpusManager.getDifficultyLabel(corpus.difficulty)}</span>
                <span class="corpus-topic">${corpusManager.getTopicLabel(corpus.topic)}</span>
            </div>
            <div class="corpus-item-text">${corpus.originalText.substring(0, 60)}...</div>
            <div class="corpus-item-actions">
                <button class="text-btn start-corpus" data-id="${corpus.id}">开始练习</button>
            </div>
        </div>
    `).join('');
    
    // 绑定事件
    DOM.corpusList.querySelectorAll('.start-corpus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const corpusId = e.target.dataset.id;
            startPracticeWithCorpus(corpusId);
        });
    });
}

/**
 * 用指定语料开始练习
 */
function startPracticeWithCorpus(corpusId) {
    if (!AppState.config) {
        showToast('请先完成配置');
        showConfigModal();
        return;
    }
    
    corpusManager.setSingleCorpus(corpusId);
    startPractice();
}

/**
 * 初始化个人中心
 */
function initProfilePage() {
    const stats = StatsCalculator.calculate();
    
    DOM.statTotal.textContent = stats.totalCount;
    DOM.statAccuracy.textContent = `${stats.avgTotalScore}%`;
    DOM.statStreak.textContent = stats.streakDays;
    DOM.statTime.textContent = StatsCalculator.formatTime(stats.totalTime);
    
    // 用户信息
    if (AppState.config) {
        DOM.userMbti.textContent = `${AppState.config.mbti || '英语'}学习者`;
        DOM.userVocab.textContent = AppState.config.vocabulary ? `词汇量 ${AppState.config.vocabulary}` : '未设置';
    } else {
        DOM.userMbti.textContent = '英语学习者';
        DOM.userVocab.textContent = '未设置';
    }
    
    // 收藏数
    const favorites = RecordStorage.getFavorites();
    DOM.favoritesCount.textContent = favorites.length;
    
    // 错题数
    DOM.wrongTotalCount.textContent = RecordStorage.getWrongCount();
    
    // 打卡日历
    renderCalendar();
}

/**
 * 渲染打卡日历
 */
function renderCalendar() {
    const checkinDates = JSON.parse(localStorage.getItem('checkin_dates') || '[]');
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    
    // 获取当月天数
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    
    let html = '';
    
    // 星期标题
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    weekDays.forEach(day => {
        html += `<div class="calendar-day-title">${day}</div>`;
    });
    
    // 填充空白
    for (let i = 0; i < firstDay; i++) {
        html += '<div class="calendar-day empty"></div>';
    }
    
    // 日期
    for (let day = 1; day <= daysInMonth; day++) {
        const dateStr = new Date(year, month, day).toDateString();
        const isCheckin = checkinDates.includes(dateStr);
        const isToday = dateStr === today.toDateString();
        
        html += `
            <div class="calendar-day ${isCheckin ? 'checked' : ''} ${isToday ? 'today' : ''}">
                ${day}
            </div>
        `;
    }
    
    DOM.calendarGrid.innerHTML = html;
}

/**
 * 初始化错题页面
 */
function initWrongPage() {
    renderWrongList(AppState.wrongFilter);
}

/**
 * 渲染错题列表
 */
function renderWrongList(filter) {
    const records = RecordStorage.getAll();
    let wrongRecords;
    
    if (filter === 'all') {
        wrongRecords = records.filter(r => {
            const threshold = AppState.config ? AppState.config.threshold / 100 : 0.9;
            return r.translationScore < threshold || r.backScore < threshold;
        });
    } else if (filter === 'translation') {
        const threshold = AppState.config ? AppState.config.threshold / 100 : 0.9;
        wrongRecords = records.filter(r => r.translationScore < threshold);
    } else {
        const threshold = AppState.config ? AppState.config.threshold / 100 : 0.9;
        wrongRecords = records.filter(r => r.backScore < threshold);
    }
    
    if (wrongRecords.length === 0) {
        DOM.wrongList.innerHTML = '<p class="empty-state">暂无错题记录</p>';
        return;
    }
    
    DOM.wrongList.innerHTML = wrongRecords.map(record => {
        const threshold = AppState.config ? AppState.config.threshold / 100 : 0.9;
        const isTranslationWrong = record.translationScore < threshold;
        const isBackWrong = record.backScore < threshold;
        
        return `
            <div class="wrong-item">
                <div class="wrong-item-header">
                    <span class="wrong-text">${record.originalText.substring(0, 40)}...</span>
                    <span class="wrong-date">${new Date(record.completedAt).toLocaleDateString()}</span>
                </div>
                <div class="wrong-scores">
                    <span class="score-tag ${isTranslationWrong ? 'wrong' : 'pass'}">翻译: ${Math.round(record.translationScore * 100)}%</span>
                    <span class="score-tag ${isBackWrong ? 'wrong' : 'pass'}">回译: ${Math.round(record.backScore * 100)}%</span>
                </div>
                <div class="wrong-actions">
                    <button class="text-btn retry-wrong" data-id="${record.id}">重新练习</button>
                </div>
            </div>
        `;
    }).join('');
    
    // 绑定重练事件
    DOM.wrongList.querySelectorAll('.retry-wrong').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const recordId = e.target.dataset.id;
            const record = records.find(r => r.id === recordId);
            if (record && record.corpusId) {
                startPracticeWithCorpus(record.corpusId);
            }
        });
    });
}

/**
 * 显示配置弹窗
 */
function showConfigModal() {
    initConfigModal();
    DOM.configModal.classList.remove('hidden');
}

/**
 * 隐藏配置弹窗
 */
function hideConfigModal() {
    DOM.configModal.classList.add('hidden');
}

/**
 * 初始化配置弹窗
 */
function initConfigModal() {
    // 生成MBTI选择器
    const mbtiKeys = Object.keys(MBTI_DATA);
    let mbtiHTML = '';
    
    mbtiKeys.forEach(key => {
        const data = MBTI_DATA[key];
        const isChecked = AppState.config && AppState.config.mbti === key ? 'checked' : '';
        mbtiHTML += `
            <label class="mbti-option ${isChecked ? 'active' : ''}">
                <input type="radio" name="mbti" value="${key}" ${isChecked}>
                <div class="mbti-card">
                    <span class="mbti-letter">${key}</span>
                    <span class="mbti-desc">${data.name}</span>
                </div>
            </label>
        `;
    });
    
    DOM.mbtiGrid.innerHTML = mbtiHTML;
    
    // 设置词汇量
    if (AppState.config && AppState.config.vocabulary) {
        const vocabInputs = document.querySelectorAll('input[name="vocabulary"]');
        vocabInputs.forEach(input => {
            if (parseInt(input.value) === AppState.config.vocabulary) {
                input.checked = true;
            }
        });
    }
    
    // 设置阈值
    const threshold = AppState.config ? AppState.config.threshold : 90;
    DOM.thresholdSlider.value = threshold;
    DOM.thresholdValue.textContent = `${threshold}%`;
    
    // 绑定事件
    DOM.thresholdSlider.addEventListener('input', (e) => {
        DOM.thresholdValue.textContent = `${e.target.value}%`;
    });
}

/**
 * 保存配置
 */
function saveConfig() {
    const mbti = document.querySelector('input[name="mbti"]:checked')?.value;
    const vocabInput = document.querySelector('input[name="vocabulary"]:checked');
    const vocab = vocabInput ? parseInt(vocabInput.value) : 4000;
    const threshold = parseInt(DOM.thresholdSlider.value);
    
    if (!mbti) {
        showToast('请选择MBTI类型');
        return;
    }
    
    AppState.config = new UserConfig();
    AppState.config.mbti = mbti;
    AppState.config.vocabulary = vocab;
    AppState.config.threshold = threshold;
    AppState.config.createdAt = Date.now();
    
    ConfigStorage.save(AppState.config);
    
    hideConfigModal();
    updateHomePage();
    showToast('配置已保存');
}

/**
 * 显示设置弹窗
 */
function showSettingsModal() {
    initSettingsModal();
    DOM.settingsModal.classList.remove('hidden');
}

/**
 * 隐藏设置弹窗
 */
function hideSettingsModal() {
    DOM.settingsModal.classList.add('hidden');
}

/**
 * 初始化设置弹窗
 */
function initSettingsModal() {
    if (AppState.config) {
        DOM.dailyGoal.value = AppState.config.dailyGoal || 10;
        DOM.llmProvider.value = AppState.config.llmProvider || 'siliconflow';
        
        // 判断模式
        const judgeMode = AppState.config.judgeMode || 'llm';
        document.querySelectorAll('input[name="judge-mode"]').forEach(input => {
            input.checked = input.value === judgeMode;
        });
    }
    
    // 加载保存的API Key
    const llmConfig = llmJudge.loadConfig();
    if (llmConfig) {
        DOM.llmApiKey.value = llmConfig.apiKey || '';
    }
}

/**
 * 保存设置
 */
function saveSettings() {
    if (!AppState.config) {
        AppState.config = new UserConfig();
    }
    
    AppState.config.dailyGoal = parseInt(DOM.dailyGoal.value);
    AppState.config.llmProvider = DOM.llmProvider.value;
    AppState.config.judgeMode = document.querySelector('input[name="judge-mode"]:checked').value;
    
    // 保存LLM配置
    const apiKey = DOM.llmApiKey.value;
    if (apiKey) {
        llmJudge.saveConfig(DOM.llmProvider.value, apiKey);
    }
    
    ConfigStorage.save(AppState.config);
    
    hideSettingsModal();
    updateHomePage();
    showToast('设置已保存');
}

/**
 * 重置配置
 */
function resetConfig() {
    if (confirm('确定要重置所有配置吗？学习记录将保留。')) {
        ConfigStorage.clear();
        AppState.config = null;
        hideSettingsModal();
        showConfigModal();
        updateHomePage();
        showToast('配置已重置');
    }
}

/**
 * 导入语料
 */
function importCorpus() {
    const original = DOM.importOriginal.value.trim();
    const translation = DOM.importTranslation.value.trim();
    const difficulty = DOM.importDifficulty.value;
    const topic = DOM.importTopic.value;
    
    if (!original || !translation) {
        showToast('请输入原文和翻译');
        return;
    }
    
    const corpus = {
        id: 'custom_' + Date.now(),
        originalText: original,
        referenceTranslation: translation,
        originalLang: 'en',
        difficulty: difficulty,
        topic: topic,
        source: 'custom',
        keywords: [],
        createdAt: Date.now()
    };
    
    corpusManager.addCustomCorpus(corpus);
    
    // 清空输入
    DOM.importOriginal.value = '';
    DOM.importTranslation.value = '';
    
    // 刷新题库
    initLibraryPage();
    
    showToast('语料导入成功');
}

/**
 * 开始练习
 */
function startPractice() {
    if (!AppState.config) {
        showToast('请先完成配置');
        showConfigModal();
        return;
    }
    
    showScreen('practice');
    
    // 更新会话信息
    DOM.sessionInfo.textContent = AppState.config.getSessionInfo();
    DOM.thresholdBadge.textContent = `阈值: ${AppState.config.threshold}%`;
    
    // 获取推荐语料
    corpusManager.getRecommendedCorpus(AppState.config, 10);
    
    // 加载第一个语料
    loadCurrentCorpus();
    
    // 更新统计
    updatePracticeStats();
}

/**
 * 更新练习页统计
 */
function updatePracticeStats() {
    const records = RecordStorage.getAll();
    DOM.practiceTotal.textContent = records.length;
    
    if (records.length > 0) {
        const avgScore = records.reduce((sum, r) => sum + (r.translationScore + r.backScore) / 2, 0) / records.length;
        DOM.practiceAvg.textContent = `${Math.round(avgScore * 100)}%`;
    } else {
        DOM.practiceAvg.textContent = '0%';
    }
}

/**
 * 加载当前语料
 */
function loadCurrentCorpus() {
    const corpus = corpusManager.getCurrentCorpus();
    if (!corpus) {
        showToast('没有更多语料了');
        showScreen('home');
        return;
    }
    
    AppState.currentCorpus = corpus;
    AppState.currentStage = 1;
    AppState.retryCount = { translation: 0, backTranslation: 0 };
    AppState.isFavorite = false;
    
    // 更新进度
    updateProgress();
    
    // 显示原文
    DOM.originalText.textContent = corpus.originalText;
    DOM.corpusDifficulty.textContent = corpusManager.getDifficultyLabel(corpus.difficulty);
    DOM.corpusSource.textContent = corpus.source === 'builtin' ? '内置题库' : '自定义';
    DOM.corpusTopic.textContent = corpusManager.getTopicLabel(corpus.topic);
    
    // 清空输入
    DOM.translationInput.value = '';
    DOM.charCount.textContent = '0';
    DOM.backTranslationInput.value = '';
    DOM.backCharCount.textContent = '0';
    
    // 显示阶段1
    showStage(1);
    
    // 开始计时
    AppState.questionStartTime = Date.now();
    AppState.stageStartTime = Date.now();
    
    // 聚焦输入框
    DOM.translationInput.focus();
    
    // 更新收藏按钮
    updateFavoriteButton();
}

/**
 * 更新进度
 */
function updateProgress() {
    const progress = corpusManager.getProgress();
    const percent = progress.total > 0 ? (progress.current / progress.total) * 100 : 0;
    
    DOM.progressFill.style.width = `${percent}%`;
    DOM.currentQuestion.textContent = `${progress.current} / ${progress.total}`;
}

/**
 * 显示指定阶段
 */
function showStage(stage) {
    DOM.stage1.classList.remove('active');
    DOM.stage2.classList.remove('active');
    DOM.feedbackPanel.classList.add('hidden');
    DOM.completionPanel.classList.add('hidden');
    
    if (stage === 1) {
        DOM.stage1.classList.add('active');
    } else if (stage === 2) {
        DOM.referenceText.textContent = AppState.currentCorpus.referenceTranslation;
        DOM.stage2.classList.add('active');
        DOM.backTranslationInput.focus();
    } else if (stage === 'complete') {
        DOM.completionPanel.classList.remove('hidden');
    }
    
    AppState.currentStage = stage;
}

/**
 * 提交翻译
 */
async function submitTranslation() {
    const userTranslation = DOM.translationInput.value.trim();
    
    if (!userTranslation) {
        showToast('请输入翻译内容');
        return;
    }
    
    AppState.userTranslation = userTranslation;
    
    // Loading
    const submitBtn = DOM.submitTranslation;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>评判中...</span>';
    submitBtn.disabled = true;
    
    try {
        let result;
        let diffAnalysis;
        
        const judgeMode = AppState.config?.judgeMode || 'rule';
        
        if (judgeMode === 'llm' && llmJudge.isConfigured()) {
            const llmResult = await llmJudge.judgeTranslation(
                userTranslation,
                AppState.currentCorpus.referenceTranslation,
                AppState.currentCorpus.originalText,
                AppState.currentCorpus.originalLang
            );
            
            if (llmResult.error) {
                showToast(llmResult.error);
                result = translationEngine.calculateConfidence(
                    userTranslation,
                    AppState.currentCorpus.referenceTranslation,
                    AppState.currentCorpus.originalText
                );
            } else {
                result = { 
                    total: llmResult.score, 
                    feedback: llmResult.feedback,
                    isLLM: true
                };
            }
        } else {
            result = translationEngine.calculateConfidence(
                userTranslation,
                AppState.currentCorpus.referenceTranslation,
                AppState.currentCorpus.originalText
            );
        }
        
        AppState.translationScore = result.total;
        
        diffAnalysis = diffAnalyzer.analyze(
            userTranslation,
            AppState.currentCorpus.referenceTranslation,
            AppState.currentCorpus.originalLang
        );
        
        showFeedback(result.total, diffAnalysis, 1, result.feedback);
        
    } catch (error) {
        showToast('评判出错: ' + error.message);
        const result = translationEngine.calculateConfidence(
            userTranslation,
            AppState.currentCorpus.referenceTranslation,
            AppState.currentCorpus.originalText
        );
        AppState.translationScore = result.total;
        const diffAnalysis = diffAnalyzer.analyze(
            userTranslation,
            AppState.currentCorpus.referenceTranslation,
            AppState.currentCorpus.originalLang
        );
        showFeedback(result.total, diffAnalysis, 1);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * 提交回译
 */
async function submitBackTranslation() {
    const userBackTranslation = DOM.backTranslationInput.value.trim();
    
    if (!userBackTranslation) {
        showToast('请输入回译内容');
        return;
    }
    
    AppState.userBackTranslation = userBackTranslation;
    
    const submitBtn = DOM.submitBackTranslation;
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<span>评判中...</span>';
    submitBtn.disabled = true;
    
    try {
        let result;
        let diffAnalysis;
        
        const judgeMode = AppState.config?.judgeMode || 'rule';
        
        if (judgeMode === 'llm' && llmJudge.isConfigured()) {
            const llmResult = await llmJudge.judgeBackTranslation(
                userBackTranslation,
                AppState.currentCorpus.originalText,
                AppState.currentCorpus.originalLang
            );
            
            if (llmResult.error) {
                showToast(llmResult.error);
                result = translationEngine.calculateConfidence(
                    userBackTranslation,
                    AppState.currentCorpus.originalText,
                    AppState.currentCorpus.referenceTranslation
                );
            } else {
                result = { 
                    total: llmResult.score, 
                    feedback: llmResult.feedback,
                    isLLM: true
                };
            }
        } else {
            result = translationEngine.calculateConfidence(
                userBackTranslation,
                AppState.currentCorpus.originalText,
                AppState.currentCorpus.referenceTranslation
            );
        }
        
        AppState.backScore = result.total;
        
        diffAnalysis = diffAnalyzer.analyze(
            userBackTranslation,
            AppState.currentCorpus.originalText,
            AppState.currentCorpus.originalLang === 'en' ? 'zh' : 'en'
        );
        
        showFeedback(result.total, diffAnalysis, 2, result.feedback);
        
    } catch (error) {
        showToast('评判出错: ' + error.message);
        const result = translationEngine.calculateConfidence(
            userBackTranslation,
            AppState.currentCorpus.originalText,
            AppState.currentCorpus.referenceTranslation
        );
        AppState.backScore = result.total;
        const diffAnalysis = diffAnalyzer.analyze(
            userBackTranslation,
            AppState.currentCorpus.originalText,
            AppState.currentCorpus.originalLang === 'en' ? 'zh' : 'en'
        );
        showFeedback(result.total, diffAnalysis, 2);
    } finally {
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
}

/**
 * 显示反馈
 */
function showFeedback(score, analysis, stage, llmFeedback = null) {
    const threshold = AppState.config.threshold / 100;
    const isPass = score >= threshold;
    
    // 置信度仪表
    const percent = Math.round(score * 100);
    DOM.confidenceText.textContent = `${percent}%`;
    
    const circumference = 2 * Math.PI * 15.9155;
    DOM.confidenceCircle.style.strokeDasharray = `${percent}, 100`;
    DOM.confidenceCircle.classList.remove('pass', 'fail');
    DOM.confidenceCircle.classList.add(isPass ? 'pass' : 'fail');
    
    // 状态
    DOM.feedbackStatus.classList.remove('pass', 'fail');
    DOM.feedbackStatus.classList.add(isPass ? 'pass' : 'fail');
    
    let statusMessage;
    if (llmFeedback) {
        statusMessage = isPass ? '✅ AI评判通过！' : `⚠️ ${llmFeedback}`;
    } else {
        const statusDesc = translationEngine.getStatusDescription(score, threshold);
        statusMessage = isPass ? '达标！' : statusDesc.message;
    }
    
    DOM.feedbackStatus.innerHTML = `
        <span class="status-icon">${isPass ? '✅' : '⚠️'}</span>
        <span class="status-text">${statusMessage}</span>
    `;
    
    // Diff内容
    if (llmFeedback && isPass) {
        DOM.diffContent.innerHTML = `<div class="llm-feedback">${llmFeedback}</div>`;
    } else {
        DOM.diffContent.innerHTML = diffAnalyzer.renderDiffHTML(analysis);
    }
    
    // 重试计数
    if (stage === 1) {
        AppState.retryCount.translation++;
    } else {
        AppState.retryCount.backTranslation++;
    }
    
    // 显示反馈面板
    DOM.feedbackPanel.classList.remove('hidden');
    
    if (isPass) {
        setTimeout(() => {
            DOM.feedbackPanel.classList.add('hidden');
            
            if (stage === 1) {
                showStage(2);
                AppState.stageStartTime = Date.now();
            } else {
                completeQuestion();
            }
        }, 1500);
    }
}

/**
 * 完成当前题目
 */
function completeQuestion() {
    const totalTime = Math.round((Date.now() - AppState.questionStartTime) / 1000);
    
    const record = {
        id: 'record_' + Date.now(),
        corpusId: AppState.currentCorpus.id,
        originalText: AppState.currentCorpus.originalText,
        originalLang: AppState.currentCorpus.originalLang,
        userTranslation: AppState.userTranslation,
        userBackTranslation: AppState.userBackTranslation,
        translationScore: AppState.translationScore,
        backScore: AppState.backScore,
        totalTime,
        difficulty: AppState.currentCorpus.difficulty,
        topic: AppState.currentCorpus.topic,
        retryCount: AppState.retryCount,
        completedAt: Date.now()
    };
    
    RecordStorage.save(record);
    
    updatePracticeStats();
    updateHomePage();
    
    showCompletionPanel(record);
}

/**
 * 显示完成面板
 */
function showCompletionPanel(record) {
    showStage('complete');
    
    DOM.completionTime.textContent = formatTime(record.totalTime);
    DOM.completionTranslationScore.textContent = `${Math.round(record.translationScore * 100)}%`;
    DOM.completionBackScore.textContent = `${Math.round(record.backScore * 100)}%`;
    
    const summary = generateSummary(record);
    DOM.summaryContent.innerHTML = summary;
    
    updateFavoriteButton();
}

/**
 * 生成综合分析
 */
function generateSummary(record) {
    let html = '<ul>';
    
    if (record.translationScore >= 0.9) {
        html += '<li>翻译质量优秀，准确传达了原文含义</li>';
    } else if (record.translationScore >= 0.7) {
        html += '<li>翻译基本准确，部分细节可以改进</li>';
    } else {
        html += '<li>翻译存在偏差，建议回顾Diff分析中的建议</li>';
    }
    
    if (record.backScore >= 0.9) {
        html += '<li>回译还原度高，双向翻译一致性良好</li>';
    } else if (record.backScore >= 0.7) {
        html += '<li>回译基本还原，部分表达可以更精确</li>';
    } else {
        html += '<li>回译与原文有较大差异，需要注意翻译策略</li>';
    }
    
    if (record.retryCount.translation > 2 || record.retryCount.backTranslation > 2) {
        html += '<li>本题经过多次尝试，建议收藏后复习巩固</li>';
    }
    
    html += '</ul>';
    return html;
}

/**
 * 下一题
 */
function nextQuestion() {
    if (corpusManager.hasNextCorpus()) {
        corpusManager.nextCorpus();
        loadCurrentCorpus();
    } else {
        showToast('恭喜完成本次训练！');
        showScreen('home');
        updateHomePage();
    }
}

/**
 * 切换收藏
 */
function toggleFavorite() {
    if (!AppState.currentCorpus) return;
    
    AppState.isFavorite = !AppState.isFavorite;
    
    const record = {
        id: 'fav_' + Date.now(),
        corpusId: AppState.currentCorpus.id,
        originalText: AppState.currentCorpus.originalText,
        referenceTranslation: AppState.currentCorpus.referenceTranslation,
        originalLang: AppState.currentCorpus.originalLang,
        difficulty: AppState.currentCorpus.difficulty,
        topic: AppState.currentCorpus.topic,
        favoritedAt: Date.now()
    };
    
    if (AppState.isFavorite) {
        RecordStorage.addFavorite(record);
        showToast('已添加到收藏');
    } else {
        RecordStorage.removeFavorite(record.id);
        showToast('已取消收藏');
    }
    
    updateFavoriteButton();
}

/**
 * 更新收藏按钮
 */
function updateFavoriteButton() {
    DOM.favoriteBtn.classList.toggle('active', AppState.isFavorite);
}

/**
 * 显示Toast
 */
function showToast(message) {
    DOM.toast.querySelector('.toast-message').textContent = message;
    DOM.toast.classList.remove('hidden');
    
    setTimeout(() => {
        DOM.toast.classList.add('hidden');
    }, 3000);
}

/**
 * 格式化时间
 */
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * 绑定事件
 */
function bindEvents() {
    // 首页按钮
    document.getElementById('btn-config').addEventListener('click', showConfigModal);
    document.getElementById('btn-start').addEventListener('click', startPractice);
    document.getElementById('btn-wrong').addEventListener('click', () => showScreen('wrong'));
    document.getElementById('btn-library').addEventListener('click', () => showScreen('library'));
    document.getElementById('btn-profile').addEventListener('click', () => showScreen('profile'));
    document.getElementById('btn-settings').addEventListener('click', showSettingsModal);
    document.getElementById('btn-checkin').addEventListener('click', doCheckin);
    
    // 配置弹窗
    document.getElementById('close-config').addEventListener('click', hideConfigModal);
    document.querySelector('#config-modal .modal-backdrop').addEventListener('click', hideConfigModal);
    document.getElementById('save-config-btn').addEventListener('click', saveConfig);
    document.getElementById('skip-config-btn').addEventListener('click', () => {
        if (!AppState.config) {
            showToast('请先完成配置');
            return;
        }
        hideConfigModal();
    });
    
    // 设置弹窗
    document.getElementById('close-settings').addEventListener('click', hideSettingsModal);
    document.querySelector('#settings-modal .modal-backdrop').addEventListener('click', hideSettingsModal);
    document.getElementById('save-settings-btn').addEventListener('click', saveSettings);
    document.getElementById('reset-config-btn').addEventListener('click', resetConfig);
    
    // 学习页面
    document.getElementById('practice-back-btn').addEventListener('click', () => {
        if (confirm('确定要返回首页吗？当前进度不会保存。')) {
            showScreen('home');
        }
    });
    document.getElementById('practice-settings-btn').addEventListener('click', showSettingsModal);
    
    // 提交翻译
    DOM.submitTranslation.addEventListener('click', submitTranslation);
    DOM.submitBackTranslation.addEventListener('click', submitBackTranslation);
    
    // 输入统计
    DOM.translationInput.addEventListener('input', () => {
        DOM.charCount.textContent = DOM.translationInput.value.length;
    });
    DOM.backTranslationInput.addEventListener('input', () => {
        DOM.backCharCount.textContent = DOM.backTranslationInput.value.length;
    });
    
    // 快捷键
    DOM.translationInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') submitTranslation();
    });
    DOM.backTranslationInput.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'Enter') submitBackTranslation();
    });
    
    // 继续翻译（保持输入，再次提交）
    DOM.retryBtn.addEventListener('click', () => {
        DOM.feedbackPanel.classList.add('hidden');
        if (AppState.currentStage === 1) {
            DOM.translationInput.focus();
        } else {
            DOM.backTranslationInput.focus();
        }
    });
    
    // 清除按钮（一键清空输入）
    DOM.clearBtn.addEventListener('click', () => {
        DOM.feedbackPanel.classList.add('hidden');
        if (AppState.currentStage === 1) {
            DOM.translationInput.value = '';
            DOM.charCount.textContent = '0';
            DOM.translationInput.focus();
        } else {
            DOM.backTranslationInput.value = '';
            DOM.backCharCount.textContent = '0';
            DOM.backTranslationInput.focus();
        }
    });
    
    // 提示
    DOM.hintBtn.addEventListener('click', () => {
        if (AppState.currentCorpus && AppState.currentCorpus.keywords) {
            const hint = AppState.currentCorpus.keywords.slice(0, 3).join(', ');
            showToast(`提示关键词: ${hint}`);
        }
    });
    
    // 下一题/收藏
    DOM.nextQuestionBtn.addEventListener('click', nextQuestion);
    DOM.favoriteBtn.addEventListener('click', toggleFavorite);
    
    // 题库页面
    document.getElementById('library-back-btn').addEventListener('click', () => showScreen('home'));
    
    // 题库模式选择
    document.querySelectorAll('.mode-option input').forEach(input => {
        input.addEventListener('change', (e) => {
            document.querySelectorAll('.mode-option').forEach(opt => opt.classList.remove('active'));
            e.target.closest('.mode-option').classList.add('active');
            renderCorpusList(e.target.value);
        });
    });
    
    // 导入语料
    DOM.confirmImport.addEventListener('click', importCorpus);
    
    // 个人中心
    document.getElementById('profile-back-btn').addEventListener('click', () => showScreen('home'));
    document.getElementById('btn-favorites').addEventListener('click', () => {
        showToast('收藏功能开发中');
    });
    document.getElementById('btn-profile-wrong').addEventListener('click', () => showScreen('wrong'));
    document.getElementById('btn-history').addEventListener('click', () => {
        showToast('历史记录功能开发中');
    });
    
    // 错题页面
    document.getElementById('wrong-back-btn').addEventListener('click', () => {
        if (AppState.config) {
            showScreen('profile');
        } else {
            showScreen('home');
        }
    });
    
    DOM.wrongTabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            DOM.wrongTabs.forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            AppState.wrongFilter = e.target.dataset.tab;
            renderWrongList(AppState.wrongFilter);
        });
    });
}

// 初始化
document.addEventListener('DOMContentLoaded', initApp);