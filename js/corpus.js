/**
 * corpus.js - 语料库管理
 */

// 内置语料库
const BUILTIN_CORPUS = [
    // A2-B1 难度
    {
        id: 'builtin_001',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The meeting will start at nine o\'clock in the morning.',
        referenceTranslation: '会议将在早上九点开始。',
        difficulty: 'A2',
        topic: 'daily',
        keywords: ['meeting', 'start', 'morning', 'nine'],
        mbtiSuitability: ['ENFP', 'ESFP', 'ENFJ', 'ESFJ']
    },
    {
        id: 'builtin_002',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'I would like to schedule a call with you next week.',
        referenceTranslation: '我想和您安排下周通一次电话。',
        difficulty: 'B1',
        topic: 'business',
        keywords: ['schedule', 'call', 'week'],
        mbtiSuitability: ['ENTJ', 'ESTJ', 'INTJ', 'ISTJ']
    },
    {
        id: 'builtin_003',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The company reported a significant increase in revenue this quarter.',
        referenceTranslation: '公司报告本季度收入显著增长。',
        difficulty: 'B1',
        topic: 'business',
        keywords: ['company', 'reported', 'increase', 'revenue', 'quarter'],
        mbtiSuitability: ['INTJ', 'ENTJ', 'ISTP', 'ESTP']
    },
    {
        id: 'builtin_004',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'Can you please send me the latest report by Friday?',
        referenceTranslation: '您能请在周五之前把最新报告发给我吗？',
        difficulty: 'A2',
        topic: 'business',
        keywords: ['send', 'report', 'Friday'],
        mbtiSuitability: ['ESFJ', 'ISFJ', 'ENFJ', 'INFJ']
    },
    {
        id: 'builtin_005',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The weather forecast predicts rain for the entire weekend.',
        referenceTranslation: '天气预报预测整个周末都会下雨。',
        difficulty: 'A2',
        topic: 'daily',
        keywords: ['weather', 'forecast', 'rain', 'weekend'],
        mbtiSuitability: ['ENFP', 'ESFP', 'INFP', 'ISFP']
    },
    // B2 难度
    {
        id: 'builtin_006',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'Artificial intelligence has the potential to revolutionize healthcare by enabling more accurate diagnoses.',
        referenceTranslation: '人工智能有潜力通过实现更准确的诊断来革新医疗保健。',
        difficulty: 'B2',
        topic: 'tech',
        keywords: ['artificial intelligence', 'revolutionize', 'healthcare', 'diagnoses'],
        mbtiSuitability: ['INTJ', 'INTP', 'ENTP', 'ENTJ']
    },
    {
        id: 'builtin_007',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The rapid advancement of technology has fundamentally altered the way we communicate and access information.',
        referenceTranslation: '技术的快速进步从根本上改变了我们交流和获取信息的方式。',
        difficulty: 'B2',
        topic: 'tech',
        keywords: ['advancement', 'technology', 'fundamentally', 'communicate', 'access'],
        mbtiSuitability: ['INTJ', 'ENTJ', 'INTP', 'ENTP']
    },
    {
        id: 'builtin_008',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'Global trade agreements require careful negotiation to balance competing economic interests.',
        referenceTranslation: '全球贸易协定需要仔细谈判以平衡相互竞争的经济利益。',
        difficulty: 'B2',
        topic: 'business',
        keywords: ['global', 'trade', 'agreements', 'negotiation', 'economic'],
        mbtiSuitability: ['ENTJ', 'INTJ', 'ESTJ', 'ISTJ']
    },
    {
        id: 'builtin_009',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The study suggests that remote work can increase productivity while reducing commuting stress.',
        referenceTranslation: '研究表明，远程工作可以提高生产力，同时减少通勤压力。',
        difficulty: 'B2',
        topic: 'business',
        keywords: ['study', 'suggests', 'remote work', 'productivity', 'commuting'],
        mbtiSuitability: ['INTJ', 'INTP', 'INFJ', 'INFP']
    },
    {
        id: 'builtin_010',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'Climate change poses significant challenges to agricultural systems worldwide.',
        referenceTranslation: '气候变化对全球农业系统构成重大挑战。',
        difficulty: 'B2',
        topic: 'news',
        keywords: ['climate change', 'poses', 'challenges', 'agricultural'],
        mbtiSuitability: ['INTJ', 'INFJ', 'ENTJ', 'ENFJ']
    },
    // C1 难度
    {
        id: 'builtin_011',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The epistemological foundations of scientific methodology remain a subject of ongoing philosophical debate.',
        referenceTranslation: '科学方法论的认识论基础仍然是持续哲学争论的主题。',
        difficulty: 'C1',
        topic: 'academic',
        keywords: ['epistemological', 'foundations', 'methodology', 'philosophical'],
        mbtiSuitability: ['INTJ', 'INTP', 'INFJ', 'INFP']
    },
    {
        id: 'builtin_012',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The implementation of machine learning algorithms requires careful consideration of ethical implications.',
        referenceTranslation: '机器学习算法的实施需要仔细考虑伦理影响。',
        difficulty: 'C1',
        topic: 'tech',
        keywords: ['implementation', 'machine learning', 'algorithms', 'ethical'],
        mbtiSuitability: ['INTJ', 'INTP', 'ENTJ', 'INFJ']
    },
    {
        id: 'builtin_013',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'Economic liberalization policies have historically generated both opportunities and inequalities.',
        referenceTranslation: '经济自由化政策在历史上既创造了机会，也造成了不平等。',
        difficulty: 'C1',
        topic: 'business',
        keywords: ['economic', 'liberalization', 'policies', 'inequalities'],
        mbtiSuitability: ['INTJ', 'ENTJ', 'INTP', 'ENTP']
    },
    {
        id: 'builtin_014',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The integration of diverse perspectives enhances the robustness of academic discourse.',
        referenceTranslation: '融合多样化视角增强了学术讨论的严谨性。',
        difficulty: 'C1',
        topic: 'academic',
        keywords: ['integration', 'diverse', 'perspectives', 'robustness', 'discourse'],
        mbtiSuitability: ['INFJ', 'INFP', 'ENFJ', 'ENFP']
    },
    {
        id: 'builtin_015',
        source: 'builtin',
        originalLang: 'en',
        originalText: 'The Art of War teaches us to rely not on the likelihood of the enemy not attacking, but on our own readiness to meet him.',
        referenceTranslation: '孙子兵法教导我们不要依赖敌人不进攻的可能性，而要依赖我们自己的准备去迎接敌人。',
        difficulty: 'C1',
        topic: 'literature',
        keywords: ['Art of War', 'rely', 'likelihood', 'enemy', 'readiness'],
        mbtiSuitability: ['INTJ', 'ENTJ', 'INTP', 'ISTJ']
    },
    // 中文到英文的语料
    {
        id: 'builtin_016',
        source: 'builtin',
        originalLang: 'zh',
        originalText: '这本书值得我们认真阅读。',
        referenceTranslation: 'This book is worth our serious reading.',
        difficulty: 'B1',
        topic: 'daily',
        keywords: ['值得', '认真', '阅读'],
        mbtiSuitability: ['INFJ', 'INFP', 'INTJ', 'INTP']
    },
    {
        id: 'builtin_017',
        source: 'builtin',
        originalLang: 'zh',
        originalText: '他因为工作表现出色而获得了晋升。',
        referenceTranslation: 'He was promoted because of his excellent work performance.',
        difficulty: 'B1',
        topic: 'business',
        keywords: ['晋升', '工作', '出色'],
        mbtiSuitability: ['ESTJ', 'ISTJ', 'ENTJ', 'INTJ']
    },
    {
        id: 'builtin_018',
        source: 'builtin',
        originalLang: 'zh',
        originalText: '随着科技的发展，人们的生活方式发生了巨大变化。',
        referenceTranslation: 'With the development of technology, people\'s way of life has changed dramatically.',
        difficulty: 'B2',
        topic: 'tech',
        keywords: ['科技', '发展', '生活方式', '变化'],
        mbtiSuitability: ['INTJ', 'INTP', 'ENTP', 'ENTJ']
    },
    {
        id: 'builtin_019',
        source: 'builtin',
        originalLang: 'zh',
        originalText: '环境保护是当今社会面临的重要课题。',
        referenceTranslation: 'Environmental protection is an important issue facing today\'s society.',
        difficulty: 'B2',
        topic: 'news',
        keywords: ['环境保护', '社会', '重要'],
        mbtiSuitability: ['INFJ', 'ENFJ', 'INFP', 'ENFP']
    },
    {
        id: 'builtin_020',
        source: 'builtin',
        originalLang: 'zh',
        originalText: '知识就是力量，这句话在今天依然适用。',
        referenceTranslation: 'Knowledge is power, and this saying is still applicable today.',
        difficulty: 'A2',
        topic: 'daily',
        keywords: ['知识', '力量', '适用'],
        mbtiSuitability: ['INTJ', 'INTP', 'ISTJ', 'ISFJ']
    }
];

class CorpusManager {
    constructor() {
        this.builtinCorpus = BUILTIN_CORPUS;
        this.uploadedCorpus = [];
        this.currentIndex = 0;
        this.sessionCorpus = [];
    }

    initialize() {
        this.uploadedCorpus = UploadedCorpusStorage.getAll();
    }

    generateId() {
        return 'corpus_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }

    getRecommendedCorpus(config, count = 10) {
        const recommendedDiffs = config.getRecommendedDifficulties();
        const recommendedTopics = config.getRecommendedTopics();

        // 合并所有语料源
        const allCorpus = [
            ...this.builtinCorpus,
            ...this.uploadedCorpus.filter(c => c.source === 'upload')
        ];

        // 过滤
        let filtered = allCorpus.filter(item => {
            const diffMatch = recommendedDiffs.includes(item.difficulty);
            const topicMatch = recommendedTopics.includes(item.topic);
            return diffMatch && topicMatch;
        });

        // 如果过滤后太少，放宽条件
        if (filtered.length < count) {
            filtered = allCorpus.filter(item =>
                recommendedDiffs.includes(item.difficulty)
            );
        }

        if (filtered.length < count) {
            filtered = allCorpus;
        }

        // 打乱顺序
        const shuffled = this.shuffle(filtered);

        // 返回指定数量
        this.sessionCorpus = shuffled.slice(0, Math.min(count, shuffled.length));
        this.currentIndex = 0;

        return this.sessionCorpus;
    }

    getCurrentCorpus() {
        if (this.currentIndex < this.sessionCorpus.length) {
            return this.sessionCorpus[this.currentIndex];
        }
        return null;
    }

    nextCorpus() {
        this.currentIndex++;
        return this.getCurrentCorpus();
    }

    hasNextCorpus() {
        return this.currentIndex < this.sessionCorpus.length - 1;
    }

    getProgress() {
        return {
            current: this.currentIndex + 1,
            total: this.sessionCorpus.length
        };
    }

    addUploadedCorpus(text, lang, difficulty, topic) {
        const corpus = {
            id: this.generateId(),
            source: 'upload',
            originalLang: lang,
            originalText: text,
            referenceTranslation: '',
            difficulty,
            topic,
            keywords: this.extractKeywords(text),
            mbtiSuitability: Object.keys(MBTI_DATA),
            uploadedAt: Date.now()
        };

        this.uploadedCorpus.push(corpus);
        UploadedCorpusStorage.save([corpus]);

        return corpus;
    }

    extractKeywords(text) {
        const words = text.toLowerCase()
            .replace(/[^\w\s]/g, ' ')
            .split(/\s+/)
            .filter(w => w.length > 3)
            .slice(0, 10);
        return [...new Set(words)];
    }

    shuffle(array) {
        const shuffled = [...array];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        return shuffled;
    }

    getAllCorpus() {
        return [...this.builtinCorpus, ...this.uploadedCorpus];
    }

    getTopicLabel(topicValue) {
        const topic = TOPICS.find(t => t.value === topicValue);
        return topic ? topic.label : topicValue;
    }

    getDifficultyLabel(difficulty) {
        return DIFFICULTY_MAP[difficulty] || difficulty;
    }

    getCorpusByTopic(topic) {
        return [...this.builtinCorpus, ...this.uploadedCorpus].filter(c => c.topic === topic);
    }

    addCustomCorpus(corpus) {
        this.uploadedCorpus.push(corpus);
        UploadedCorpusStorage.save([corpus]);
        return corpus;
    }

    setSingleCorpus(corpusId) {
        const allCorpus = [...this.builtinCorpus, ...this.uploadedCorpus];
        const corpus = allCorpus.find(c => c.id === corpusId);
        if (corpus) {
            this.sessionCorpus = [corpus];
            this.currentIndex = 0;
        }
    }
}

// 全局实例
const corpusManager = new CorpusManager();
