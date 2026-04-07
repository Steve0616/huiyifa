/**
 * storage.js - 本地存储管理
 */

const STORAGE_KEYS = {
    CONFIG: 'backtrans_config',
    RECORDS: 'backtrans_records',
    FAVORITES: 'backtrans_favorites',
    UPLOADED_CORPUS: 'backtrans_uploaded',
    STATS: 'backtrans_stats'
};

class Storage {
    static get(key, defaultValue = null) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : defaultValue;
        } catch (e) {
            console.error('Storage get error:', e);
            return defaultValue;
        }
    }

    static set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (e) {
            console.error('Storage set error:', e);
            return false;
        }
    }

    static remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (e) {
            console.error('Storage remove error:', e);
            return false;
        }
    }

    static clear() {
        try {
            Object.values(STORAGE_KEYS).forEach(key => {
                localStorage.removeItem(key);
            });
            return true;
        } catch (e) {
            console.error('Storage clear error:', e);
            return false;
        }
    }
}

class ConfigStorage {
    static save(config) {
        return Storage.set(STORAGE_KEYS.CONFIG, config.toJSON());
    }

    static load() {
        const data = Storage.get(STORAGE_KEYS.CONFIG);
        if (data) {
            return UserConfig.fromJSON(data);
        }
        return null;
    }

    static clear() {
        return Storage.remove(STORAGE_KEYS.CONFIG);
    }

    static exists() {
        return Storage.get(STORAGE_KEYS.CONFIG) !== null;
    }
}

class RecordStorage {
    static save(record) {
        const records = this.getAll();
        records.unshift(record);
        // 保留最近100条记录
        const trimmed = records.slice(0, 100);
        return Storage.set(STORAGE_KEYS.RECORDS, trimmed);
    }

    static getAll() {
        return Storage.get(STORAGE_KEYS.RECORDS, []);
    }

    static getRecent(limit = 10) {
        const records = this.getAll();
        return records.slice(0, limit);
    }

    static getByCorpusId(corpusId) {
        const records = this.getAll();
        return records.filter(r => r.corpusId === corpusId);
    }

    static getFavorites() {
        return Storage.get(STORAGE_KEYS.FAVORITES, []);
    }

    static addFavorite(record) {
        const favorites = this.getFavorites();
        favorites.unshift(record);
        return Storage.set(STORAGE_KEYS.FAVORITES, favorites);
    }

    static removeFavorite(recordId) {
        const favorites = this.getFavorites();
        const filtered = favorites.filter(f => f.id !== recordId);
        return Storage.set(STORAGE_KEYS.FAVORITES, filtered);
    }

    static clear() {
        return Storage.remove(STORAGE_KEYS.RECORDS);
    }

    static getWrongCount(threshold = 0.9) {
        const records = this.getAll();
        return records.filter(r => {
            return r.translationScore < threshold || r.backScore < threshold;
        }).length;
    }
}

class UploadedCorpusStorage {
    static save(corpusItems) {
        const existing = this.getAll();
        const combined = [...corpusItems, ...existing];
        // 去重
        const unique = combined.filter((item, index, self) =>
            index === self.findIndex(t => t.id === item.id)
        );
        return Storage.set(STORAGE_KEYS.UPLOADED_CORPUS, unique);
    }

    static getAll() {
        return Storage.get(STORAGE_KEYS.UPLOADED_CORPUS, []);
    }

    static getByDifficulty(difficulty) {
        return this.getAll().filter(item => item.difficulty === difficulty);
    }

    static remove(id) {
        const items = this.getAll();
        const filtered = items.filter(item => item.id !== id);
        return Storage.set(STORAGE_KEYS.UPLOADED_CORPUS, filtered);
    }

    static clear() {
        return Storage.remove(STORAGE_KEYS.UPLOADED_CORPUS);
    }
}

class StatsCalculator {
    static calculate() {
        const records = RecordStorage.getAll();

        if (records.length === 0) {
            return {
                totalCount: 0,
                avgTranslationScore: 0,
                avgBackScore: 0,
                avgTotalScore: 0,
                totalTime: 0,
                streakDays: 0,
                topicStats: {},
                difficultyStats: {},
                weakPoints: []
            };
        }

        // 计算平均分
        const totalTranslationScore = records.reduce((sum, r) => sum + (r.translationScore || 0), 0);
        const totalBackScore = records.reduce((sum, r) => sum + (r.backScore || 0), 0);
        const avgTranslationScore = (totalTranslationScore / records.length * 100).toFixed(1);
        const avgBackScore = (totalBackScore / records.length * 100).toFixed(1);
        const avgTotalScore = ((parseFloat(avgTranslationScore) + parseFloat(avgBackScore)) / 2).toFixed(1);

        // 计算总时长
        const totalTime = records.reduce((sum, r) => sum + (r.totalTime || 0), 0);

        // 计算连续天数
        const streakDays = this.calculateStreak(records);

        // 话题统计
        const topicStats = {};
        const difficultyStats = {};
        records.forEach(r => {
            if (r.topic) {
                topicStats[r.topic] = (topicStats[r.topic] || 0) + 1;
            }
            if (r.difficulty) {
                difficultyStats[r.difficulty] = (difficultyStats[r.difficulty] || 0) + 1;
            }
        });

        // 找出薄弱点（得分较低的记录）
        const weakPoints = records
            .filter(r => (r.translationScore + r.backScore) / 2 < 0.8)
            .slice(0, 10)
            .map(r => ({
                text: r.originalText.substring(0, 50),
                score: ((r.translationScore + r.backScore) / 2 * 100).toFixed(0)
            }));

        return {
            totalCount: records.length,
            avgTranslationScore: parseFloat(avgTranslationScore),
            avgBackScore: parseFloat(avgBackScore),
            avgTotalScore: parseFloat(avgTotalScore),
            totalTime,
            streakDays,
            topicStats,
            difficultyStats,
            weakPoints
        };
    }

    static calculateStreak(records) {
        if (records.length === 0) return 0;

        // 按日期分组
        const dates = [...new Set(records.map(r => {
            const d = new Date(r.completedAt);
            return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
        }))].sort().reverse();

        let streak = 0;
        const today = new Date();
        let checkDate = new Date(today);

        for (const dateStr of dates) {
            const [y, m, d] = dateStr.split('-').map(Number);
            const recordDate = new Date(y, m, d);

            // 检查是否连续
            const diff = Math.floor((checkDate - recordDate) / (1000 * 60 * 60 * 24));

            if (diff <= 1) {
                streak++;
                checkDate = recordDate;
            } else {
                break;
            }
        }

        return streak;
    }

    static formatTime(seconds) {
        if (seconds < 60) return `${seconds}s`;
        if (seconds < 3600) return `${Math.floor(seconds / 60)}m`;
        const hours = Math.floor(seconds / 3600);
        const mins = Math.floor((seconds % 3600) / 60);
        return `${hours}h${mins}m`;
    }
}
