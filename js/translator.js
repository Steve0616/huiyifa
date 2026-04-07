/**
 * translator.js - 翻译和置信度计算模块
 * 优化版：增加同义词匹配、语义容错、灵活的判断逻辑
 */

// 同义词词库（常用英汉对应）
const SYNONYM_DICT = {
    // 常见动词
    'got': ['获得', '得到', '拿到', '取得'],
    'get': ['获得', '得到', '拿到', '取得', '收到'],
    'went': ['去', '前往', '走到'],
    'go': ['去', '前往', '走'],
    'came': ['来', '来到', '过来'],
    'come': ['来', '来到', '过来'],
    'saw': ['看到', '看见', '见到'],
    'see': ['看到', '看见', '见到'],
    'knew': ['知道', '了解', '认识'],
    'know': ['知道', '了解', '认识'],
    'thought': ['认为', '觉得', '想', '思考'],
    'think': ['认为', '觉得', '想', '思考'],
    'wanted': ['想要', '希望', '需要', '期望'],
    'want': ['想要', '希望', '需要', '期望'],
    'needed': ['需要', '必须', '要'],
    'need': ['需要', '必须', '要'],
    'felt': ['感觉', '感到', '觉得'],
    'feel': ['感觉', '感到', '觉得'],
    'told': ['告诉', '说', '告诉'],
    'tell': ['告诉', '说', '告知'],
    'said': ['说', '说', '讲到'],
    'say': ['说', '说', '讲'],
    'asked': ['问', '询问', '请求'],
    'ask': ['问', '询问', '请求'],
    'started': ['开始', '启动', '着手'],
    'start': ['开始', '启动', '着手'],
    'found': ['发现', '找到', '，发觉'],
    'find': ['发现', '找到', '发觉'],
    'left': ['离开', '留下', '出发'],
    'leave': ['离开', '留下', '出发'],
    'put': ['放', '放置', '放'],
    'kept': ['保持', '保留', '继续'],
    'keep': ['保持', '保留', '继续'],
    'let': ['让', '允许', '使'],
    'became': ['成为', '变成', '开始'],
    'become': ['成为', '变成', '开始'],
    'seemed': ['似乎', '好像', '看来'],
    'seem': ['似乎', '好像', '看来'],
    'turned': ['变成', '转向', '转身'],
    'turn': ['变成', '转向', '转'],
    'kept': ['保持', '继续', '保留'],
    
    // 常见形容词/副词
    'good': ['好', '好的', '优秀', '棒'],
    'great': ['伟大', '很棒', '非常好', '优秀'],
    'big': ['大', '大的', '重要'],
    'small': ['小', '小的', '微小'],
    'new': ['新', '新的', '新鲜'],
    'old': ['老', '旧的', '年迈'],
    'first': ['第一', '首先', '最初'],
    'last': ['最后', '上一个', '末尾'],
    'long': ['长', '长久', '长期'],
    'short': ['短', '短期', '短暂'],
    'high': ['高', '高', '高度'],
    'low': ['低', '低', '矮'],
    'early': ['早', '早期', '提前'],
    'late': ['晚', '后期', '迟到'],
    'right': ['正确', '对', '右边'],
    'wrong': ['错误', '错', '不对'],
    'sure': ['肯定', '确定', '当然'],
    'certain': ['肯定', '确定', '一定'],
    'real': ['真实', '真的', '实际'],
    'true': ['真实', '真的', '正确'],
    'different': ['不同', '不一样', '差异'],
    'same': ['相同', '一样', '同样'],
    'whole': ['整个', '全部', '完整'],
    'part': ['部分', '部件'],
    'special': ['特别', '特殊', '专门'],
    'important': ['重要', '关键', '要紧'],
    'possible': ['可能', '或许', '可以的'],
    'able': ['能够', '可以', '会'],
    'hard': ['困难', '难', '努力'],
    'easy': ['容易', '简单', '轻松'],
    'fast': ['快', '快速', '迅速'],
    'slow': ['慢', '缓慢', '慢'],
    'just': ['只是', '仅仅', '刚才'],
    'still': ['仍然', '还是', '依旧'],
    'even': ['甚至', '还', '更'],
    'already': ['已经', '早已', '已经'],
    'almost': ['几乎', '差不多', '快要'],
    
    // 常见名词
    'time': ['时间', '时候', '时光'],
    'day': ['天', '日子', '白天'],
    'year': ['年', '年份', '岁月'],
    'people': ['人', '人们', '人们'],
    'way': ['方式', '方法', '路'],
    'thing': ['事情', '东西', '事物'],
    'world': ['世界', '全球', '天下'],
    'life': ['生活', '生命', '人生'],
    'hand': ['手', '帮助', '方面'],
    'place': ['地方', '位置', '场所'],
    'case': ['情况', '案例', '案件'],
    'week': ['周', '星期', '周末'],
    'company': ['公司', '企业'],
    'system': ['系统', '体系', '制度'],
    'program': ['程序', '项目', '计划'],
    'question': ['问题', '疑问', '议题'],
    'government': ['政府', '统治'],
    'number': ['数字', '数量', '号码'],
    'night': ['夜晚', '晚上', '夜间'],
    'point': ['点', '观点', '要点'],
    'home': ['家', '家庭', '住所'],
    'water': ['水', '水分'],
    'room': ['房间', '空间', '屋子'],
    'mother': ['母亲', '妈妈'],
    'father': ['父亲', '爸爸'],
    'child': ['孩子', '儿童'],
    'children': ['孩子', '孩子们', '儿童'],
    'eye': ['眼睛', '目光'],
    'woman': ['女人', '女性'],
    'man': ['男人', '男性'],
    
    // 常见介词/连词
    'because': ['因为', '由于'],
    'without': ['没有', '不带', '无'],
    'with': ['和', '与', '用', '带'],
    'into': ['进入', '到', '向'],
    'from': ['从', '来自', '由'],
    'about': ['关于', '大约', '附近'],
    'over': ['超过', '结束', '在上'],
    'after': ['之后', '以后', '后面'],
    'before': ['之前', '以前', '前面'],
    'under': ['在下面', '低于', '少于'],
    'while': ['当...时', '然而', '虽然'],
    'although': ['虽然', '尽管', '即使'],
    'however': ['然而', '但是', '不过'],
    'therefore': ['因此', '所以', '于是'],
    
    // 常见短语/词组
    'able to': ['能', '能够', '会'],
    'want to': ['想', '想要', '要'],
    'have to': ['必须', '得', '要'],
    'would like': ['想要', '愿意', '希望'],
    'kind of': ['有点', '有些', '相当'],
    'a lot': ['很多', '大量', '常常'],
    'a little': ['一点', '少量', '有些'],
    'as well': ['也', '同样', '还'],
    'in order to': ['为了', '以便'],
    'so that': ['以便', '为了', '使得'],
    'such as': ['例如', '比如', '诸如'],
    'in fact': ['实际上', '事实上', '其实']
};

class TranslationEngine {
    constructor() {
        this.cache = new Map();
    }

    /**
     * 计算翻译置信度 - 优化版
     * 更加宽容：同义词匹配 + 语义容错 + 灵活性
     */
    calculateConfidence(userTranslation, referenceTranslation, originalText) {
        const originalLang = originalText.match(/[\u4e00-\u9fa5]/) ? 'zh' : 'en';
        
        // 1. 核心意思匹配度 (权重: 50%) - 核心关键词匹配
        const coreScore = this.calculateCoreMeaningScore(userTranslation, referenceTranslation, originalLang);

        // 2. 同义词匹配度 (权重: 25%) - 允许同义表达
        const synonymScore = this.calculateSynonymScore(userTranslation, referenceTranslation, originalLang);

        // 3. 信息完整性 (权重: 15%) - 不惩罚合理删减
        const completenessScore = this.calculateCompletenessScoreFlexible(userTranslation, referenceTranslation, originalText);

        // 4. 长度容错度 (权重: 10%) - 允许合理的长度差异
        const lengthScore = this.calculateLengthScoreFlexible(userTranslation, referenceTranslation);

        // 综合分数 - 使用更宽容的计算方式
        const totalScore = 
            coreScore * 0.50 +
            synonymScore * 0.25 +
            completenessScore * 0.15 +
            lengthScore * 0.10;

        // 如果核心意思对了（>=70%），给予额外奖励
        let bonus = 0;
        if (coreScore >= 0.7 && totalScore < 0.9) {
            bonus = (0.9 - totalScore) * 0.3; // 最多加9%
        }

        return {
            total: Math.min(totalScore + bonus, 1),
            breakdown: {
                core: coreScore,
                synonym: synonymScore,
                completeness: completenessScore,
                length: lengthScore,
                bonus: bonus
            }
        };
    }

    /**
     * 计算核心意思匹配度
     */
    calculateCoreMeaningScore(user, reference, originalLang) {
        const userTokens = this.tokenize(user).filter(t => t.length >= 1);
        const refTokens = this.tokenize(reference).filter(t => t.length >= 1);

        if (refTokens.length === 0) return 1;

        let matches = 0;
        const matchedRefTokens = new Set();

        userTokens.forEach(ut => {
            const utLower = ut.toLowerCase();
            
            // 精确匹配
            if (refTokens.some((rt, idx) => {
                if (matchedRefTokens.has(idx)) return false;
                if (rt.toLowerCase() === utLower) {
                    matchedRefTokens.add(idx);
                    return true;
                }
                return false;
            })) {
                matches++;
            }
            // 包含匹配
            else if (refTokens.some((rt, idx) => {
                if (matchedRefTokens.has(idx)) return false;
                const rtLower = rt.toLowerCase();
                if (rtLower.includes(utLower) || utLower.includes(rtLower)) {
                    matchedRefTokens.add(idx);
                    return true;
                }
                return false;
            })) {
                matches++;
            }
        });

        // 匹配率 = 匹配数 / 参考词数（不惩罚多余词）
        return Math.min(matches / refTokens.length, 1);
    }

    /**
     * 计算同义词匹配度
     */
    calculateSynonymScore(user, reference, originalLang) {
        const userTokens = this.tokenize(user).filter(t => t.length >= 2);
        const refTokens = this.tokenize(reference).filter(t => t.length >= 1);

        if (refTokens.length === 0 || userTokens.length === 0) return 0.5;

        let synonymMatches = 0;
        const matchedRefTokens = new Set();

        userTokens.forEach(ut => {
            const utLower = ut.toLowerCase();
            
            // 检查是否有同义词匹配
            const synonyms = SYNONYM_DICT[utLower] || [];
            
            refTokens.forEach((rt, idx) => {
                if (matchedRefTokens.has(idx)) return;
                
                const rtLower = rt.toLowerCase();
                
                // 检查参考词是否在用户词对应中文中
                if (synonyms.some(syn => rtLower.includes(syn) || syn.includes(rtLower))) {
                    matchedRefTokens.add(idx);
                    synonymMatches += 0.5; // 同义词只算0.5分
                    return;
                }
            });
        });

        // 同义词匹配是额外加分，不要求太高
        return Math.min(synonymMatches / refTokens.length, 1);
    }

    /**
     * 灵活的信息完整性评分 - 不惩罚合理删减
     */
    calculateCompletenessScoreFlexible(user, reference, original) {
        const userTokens = this.tokenize(user);
        const refTokens = this.tokenize(reference);
        const origTokens = this.tokenize(original);

        // 关键信息词（在原文中的实词）
        const keyTokens = origTokens.filter(t => t.length >= 2 && !this.isStopWord(t));
        
        if (keyTokens.length === 0) return 1;

        // 检查用户翻译是否包含关键信息
        let keyMatches = 0;
        userTokens.forEach(ut => {
            const utLower = ut.toLowerCase();
            if (keyTokens.some(kt => {
                const ktLower = kt.toLowerCase();
                return ktLower === utLower || ktLower.includes(utLower) || utLower.includes(ktLower);
            })) {
                keyMatches++;
            }
        });

        // 只要包含50%以上关键信息就算通过
        const coverage = keyMatches / keyTokens.length;
        if (coverage >= 0.5) return 1;
        if (coverage >= 0.3) return 0.7;
        return 0.5;
    }

    /**
     * 灵活的长度评分 - 更宽容
     */
    calculateLengthScoreFlexible(user, reference) {
        const userLen = user.length;
        const refLen = reference.length;

        if (refLen === 0) return 1;

        // 允许长度差异在 50% - 200% 之间
        const ratio = userLen / refLen;
        
        if (ratio >= 0.5 && ratio <= 2.0) return 1;
        if (ratio >= 0.3 && ratio <= 3.0) return 0.8;
        return 0.6;
    }

    /**
     * 旧版方法保留兼容
     */
    calculateKeywordScore(user, reference) {
        return this.calculateCoreMeaningScore(user, reference, 'en');
    }

    calculateSemanticScore(user, reference) {
        // 使用更简单的Jaccard相似度
        const userTokens = new Set(this.tokenize(user).map(t => t.toLowerCase()));
        const refTokens = new Set(this.tokenize(reference).map(t => t.toLowerCase()));
        
        if (refTokens.size === 0) return 1;

        const intersection = new Set([...userTokens].filter(x => refTokens.has(x)));
        const union = new Set([...userTokens, ...refTokens]);

        return intersection.size / union.size;
    }

    calculateLengthScore(user, reference) {
        return this.calculateLengthScoreFlexible(user, reference);
    }

    calculateCompletenessScore(user, reference, original) {
        return this.calculateCompletenessScoreFlexible(user, reference, original);
    }

    /**
     * 获取n-gram
     */
    getNgrams(text, n) {
        const tokens = this.tokenize(text);
        const ngrams = [];

        for (let i = 0; i <= tokens.length - n; i++) {
            ngrams.push(tokens.slice(i, i + n).join(''));
        }

        return ngrams;
    }

    /**
     * 分词
     */
    tokenize(text) {
        return text
            .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
            .split(/\s+/)
            .filter(t => t.length > 0);
    }

    /**
     * 判断是否通过阈值
     */
    isPass(score, threshold) {
        return score >= threshold;
    }

    /**
     * 获取通过状态描述 - 更友好的提示
     */
    getStatusDescription(score, threshold) {
        const diff = threshold - score;

        if (diff <= 0) {
            return { pass: true, message: '翻译得不错，继续加油！' };
        } else if (diff <= 0.08) {
            return { pass: true, message: '已经很接近了，直接通过！' }; // 放宽2%
        } else if (diff <= 0.15) {
            return { pass: false, message: '意思基本对，稍微调整一下会更好' };
        } else if (diff <= 0.25) {
            return { pass: false, message: '有些关键信息遗漏，再试一次看看' };
        } else {
            return { pass: false, message: '和参考答案有差距，回顾一下原文再试试' };
        }
    }

    /**
     * 生成回译对比分析
     */
    analyzeBackTranslation(userBackTranslation, originalText, originalLang) {
        const keyPoints = this.extractKeyPoints(originalText);
        const restorationScore = this.calculateRestorationScore(userBackTranslation, keyPoints);

        return {
            restorationScore: restorationScore,
            keyPoints,
            feedback: this.getBackTranslationFeedback(restorationScore, originalLang)
        };
    }

    /**
     * 提取关键信息点
     */
    extractKeyPoints(text) {
        const tokens = this.tokenize(text);
        const importantTokens = tokens.filter(t => t.length >= 2 && !this.isStopWord(t));
        return [...new Set(importantTokens)];
    }

    /**
     * 计算还原度
     */
    calculateRestorationScore(backTranslation, keyPoints) {
        if (keyPoints.length === 0) return 1;

        const backTokens = this.tokenize(backTranslation).map(t => t.toLowerCase());

        let matches = 0;
        keyPoints.forEach(kp => {
            if (backTokens.some(bt => bt.includes(kp.toLowerCase()) || kp.toLowerCase().includes(bt))) {
                matches++;
            }
        });

        return matches / keyPoints.length;
    }

    /**
     * 判断是否为停用词
     */
    isStopWord(word) {
        const stopWords = [
            'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
            'is', 'are', 'was', 'were', 'be', 'been', 'have', 'has', 'had',
            'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must',
            '的', '了', '在', '是', '和', '与', '或', '但', '就', '也', '都', '而', '及'
        ];
        return stopWords.includes(word.toLowerCase());
    }

    /**
     * 获取回译反馈
     */
    getBackTranslationFeedback(score, originalLang) {
        if (score >= 0.7) { // 降低回译阈值到70%
            return {
                level: 'excellent',
                message: originalLang === 'en' ?
                    'Great! Your back-translation captured the main meaning.' :
                    '不错！回译基本还原了原文含义。'
            };
        } else if (score >= 0.5) {
            return {
                level: 'good',
                message: originalLang === 'en' ?
                    'Good attempt! Minor details need attention.' :
                    '还可以，一些小细节可以改进。'
            };
        } else if (score >= 0.3) {
            return {
                level: 'fair',
                message: originalLang === 'en' ?
                    'Some key meaning was lost in back-translation.' :
                    '部分关键信息在回译中丢失。'
            };
        } else {
            return {
                level: 'poor',
                message: originalLang === 'en' ?
                    'The back-translation differs significantly from original.' :
                    '回译与原文有较大偏差。'
            };
        }
    }
}

// 全局实例
const translationEngine = new TranslationEngine();
