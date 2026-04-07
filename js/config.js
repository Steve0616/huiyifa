/**
 * config.js - 用户配置和MBTI数据
 */

const MBTI_DATA = {
    INTJ: {
        name: '建筑师',
        description: '富有想象力和战略性的思想家',
        strengths: ['逻辑分析', '长远规划', '独立思考'],
        learningStyle: '深度钻研、理论优先'
    },
    INTP: {
        name: '逻辑学家',
        description: '善于分析、追求真理',
        strengths: ['批判性思维', '创新能力', '专注研究'],
        learningStyle: '理解原理、举一反三'
    },
    ENTJ: {
        name: '指挥官',
        description: '大胆、想象力丰富、意志坚强',
        strengths: ['领导能力', '战略思维', '高效决策'],
        learningStyle: '目标驱动、实战导向'
    },
    ENTP: {
        name: '辩论家',
        description: '聪明好奇、思维敏捷',
        strengths: ['创意发散', '口才出众', '适应力强'],
        learningStyle: '兴趣驱动、多元探索'
    },
    INFJ: {
        name: '提倡者',
        description: '安静而神秘、有洞察力',
        strengths: ['同理心', '理想主义', '创造力'],
        learningStyle: '意义导向、深度理解'
    },
    INFP: {
        name: '调停者',
        description: '诗意、善良、利他主义',
        strengths: ['情感洞察', '文字表达', '价值坚守'],
        learningStyle: '自我探索、情感共鸣'
    },
    ENFJ: {
        name: '主人公',
        description: '富有魅力、鼓舞人心',
        strengths: ['感染力', '领导力', '沟通能力'],
        learningStyle: '社交互动、实践应用'
    },
    ENFP: {
        name: '竞选者',
        description: '热情洋溢、充满灵感',
        strengths: ['热情乐观', '创意无限', '社交能力'],
        learningStyle: '自由探索、关联记忆'
    },
    ISTJ: {
        name: '物流师',
        description: '务实、可靠、注重事实',
        strengths: ['责任心', '稳定性', '执行力'],
        learningStyle: '系统学习、重复练习'
    },
    ISFJ: {
        name: '守卫者',
        description: '温暖、奉献、可靠',
        strengths: ['细致认真', '耐心守护', '忠诚可靠'],
        learningStyle: '循序渐进、实例学习'
    },
    ESTJ: {
        name: '总经理',
        description: '务实、果断、组织能力强',
        strengths: ['管理能力', '可靠性', '结果导向'],
        learningStyle: '结构清晰、目标明确'
    },
    ESFJ: {
        name: '执政官',
        description: '热情、有责任心、善于合作',
        strengths: ['人际和谐', '务实行动', '乐于助人'],
        learningStyle: '互动学习、实际应用'
    },
    ISTP: {
        name: '鉴赏家',
        description: '大胆而实际、善于分析',
        strengths: ['动手能力', '逻辑分析', '灵活变通'],
        learningStyle: '实践探索、即时反馈'
    },
    ISFP: {
        name: '探险家',
        description: '灵活、艺术家气质',
        strengths: ['审美能力', '观察力', '适应力'],
        learningStyle: '感官体验、自主探索'
    },
    ESTP: {
        name: '企业家',
        description: '活力充沛、善于感知',
        strengths: ['行动力', '应变能力', '务实主义'],
        learningStyle: '做中学、即时奖励'
    },
    ESFP: {
        name: '表演者',
        description: '自发性、魅力四射',
        strengths: ['社交能力', '表现力', '乐观积极'],
        learningStyle: '互动参与、视觉辅助'
    }
};

const VOCABULARY_LEVELS = [
    { value: 2500, label: '初级', cefr: 'A1-A2', description: '3000词汇以下，适合入门学习者' },
    { value: 4000, label: '中级', cefr: 'B1', description: '3000-5000词汇，日常生活无障碍' },
    { value: 6500, label: '中高级', cefr: 'B2', description: '5000-8000词汇，可进行学术交流' },
    { value: 9000, label: '高级', cefr: 'C1-C2', description: '8000+词汇，接近母语水平' }
];

const TOPICS = [
    { value: 'business', label: '商务英语', icon: '💼' },
    { value: 'academic', label: '学术论文', icon: '📚' },
    { value: 'daily', label: '日常口语', icon: '💬' },
    { value: 'news', label: '新闻资讯', icon: '📰' },
    { value: 'tech', label: '科技数码', icon: '💻' },
    { value: 'literature', label: '文学经典', icon: '📖' }
];

const DIFFICULTY_MAP = {
    'A1': '初级',
    'A2': '初级',
    'B1': '中级',
    'B2': '中高级',
    'C1': '高级',
    'C2': '高级'
};

// MBTI到推荐难度的映射
const MBTI_DIFFICULTY_PREFERENCE = {
    INTJ: ['B2', 'C1', 'C2'],
    INTP: ['B2', 'C1', 'C2'],
    ENTJ: ['B1', 'B2', 'C1'],
    ENTP: ['B1', 'B2', 'C1'],
    INFJ: ['B1', 'B2', 'C1'],
    INFP: ['B1', 'B2', 'C1'],
    ENFJ: ['A2', 'B1', 'B2'],
    ENFP: ['A2', 'B1', 'B2'],
    ISTJ: ['A2', 'B1', 'B2'],
    ISFJ: ['A2', 'B1', 'B2'],
    ESTJ: ['A2', 'B1', 'B2'],
    ESFJ: ['A1', 'A2', 'B1'],
    ISTP: ['A2', 'B1', 'B2'],
    ISFP: ['A1', 'A2', 'B1'],
    ESTP: ['A2', 'B1', 'B2'],
    ESFP: ['A1', 'A2', 'B1']
};

// MBTI到推荐话题的映射
const MBTI_TOPIC_PREFERENCE = {
    INTJ: ['tech', 'academic', 'business'],
    INTP: ['tech', 'academic', 'literature'],
    ENTJ: ['business', 'tech', 'news'],
    ENTP: ['news', 'tech', 'daily'],
    INFJ: ['literature', 'academic', 'daily'],
    INFP: ['literature', 'daily', 'academic'],
    ENFJ: ['daily', 'business', 'news'],
    ENFP: ['daily', 'news', 'literature'],
    ISTJ: ['business', 'academic', 'daily'],
    ISFJ: ['daily', 'business', 'literature'],
    ESTJ: ['business', 'news', 'tech'],
    ESFJ: ['daily', 'business', 'news'],
    ISTP: ['tech', 'daily', 'business'],
    ISFP: ['daily', 'literature', 'tech'],
    ESTP: ['daily', 'business', 'news'],
    ESFP: ['daily', 'news', 'business']
};

class UserConfig {
    constructor() {
        this.mbti = null;
        this.vocabulary = null;
        this.preferences = [];
        this.threshold = 90;
        this.dailyGoal = 10;
        this.sources = {
            builtin: true,
            upload: true,
            crawl: false
        };
        this.createdAt = null;
        this.updatedAt = null;
    }

    static fromJSON(json) {
        const config = new UserConfig();
        Object.assign(config, json);
        return config;
    }

    toJSON() {
        return {
            mbti: this.mbti,
            vocabulary: this.vocabulary,
            preferences: this.preferences,
            threshold: this.threshold,
            dailyGoal: this.dailyGoal,
            sources: this.sources,
            createdAt: this.createdAt,
            updatedAt: Date.now()
        };
    }

    isValid() {
        return this.mbti && this.vocabulary;
    }

    getVocabLevel() {
        for (const level of VOCABULARY_LEVELS) {
            if (this.vocabulary <= level.value) {
                return level;
            }
        }
        return VOCABULARY_LEVELS[VOCABULARY_LEVELS.length - 1];
    }

    getRecommendedDifficulties() {
        const baseDiffs = MBTI_DIFFICULTY_PREFERENCE[this.mbti] || ['B1', 'B2', 'C1'];
        const vocabLevel = this.getVocabLevel();

        // 根据词汇量调整推荐难度
        const adjusted = baseDiffs.filter(d => {
            const vocabMap = { 'A2': 2500, 'B1': 4000, 'B2': 6500, 'C1': 9000, 'C2': 12000 };
            return vocabMap[d] <= this.vocabulary * 1.5;
        });

        return adjusted.length > 0 ? adjusted : ['B1', 'B2'];
    }

    getRecommendedTopics() {
        const baseTopics = MBTI_TOPIC_PREFERENCE[this.mbti] || ['daily', 'news'];
        const combined = [...new Set([...baseTopics, ...this.preferences])];
        return combined.slice(0, 4);
    }

    getSessionInfo() {
        const mbtiName = MBTI_DATA[this.mbti]?.name || this.mbti;
        const vocabLabel = this.getVocabLevel().label;
        return `${mbtiName} · ${vocabLabel}`;
    }
}
