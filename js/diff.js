/**
 * diff.js - 差异分析模块
 */

class DiffAnalyzer {
    constructor() {
        this.analysisCache = new Map();
    }

    /**
     * 分析用户翻译与参考翻译的差异
     */
    analyze(userTranslation, referenceTranslation, originalLang) {
        const cacheKey = `${userTranslation}|${referenceTranslation}`;
        if (this.analysisCache.has(cacheKey)) {
            return this.analysisCache.get(cacheKey);
        }

        const result = {
            keywordDiffs: [],
            semanticDiffs: [],
            grammarDiffs: [],
            missingTerms: [],
            extraTerms: [],
            suggestions: []
        };

        // 1. 关键词匹配分析
        result.keywordDiffs = this.findKeywordDiffs(userTranslation, referenceTranslation);

        // 2. 语义差异分析
        result.semanticDiffs = this.findSemanticDiffs(userTranslation, referenceTranslation, originalLang);

        // 3. 缺失/多余词汇
        result.missingTerms = this.findMissingTerms(userTranslation, referenceTranslation);
        result.extraTerms = this.findExtraTerms(userTranslation, referenceTranslation);

        // 4. 生成建议
        result.suggestions = this.generateSuggestions(result, originalLang);

        // 缓存结果
        this.analysisCache.set(cacheKey, result);

        return result;
    }

    /**
     * 查找关键词差异
     */
    findKeywordDiffs(user, reference) {
        const diffs = [];
        const userWords = this.tokenize(user);
        const refWords = this.tokenize(reference);

        // 找出参考翻译中的关键词在用户翻译中的匹配情况
        const criticalTerms = this.extractCriticalTerms(reference);

        criticalTerms.forEach(term => {
            const termLower = term.toLowerCase();
            const found = userWords.some(w => w.toLowerCase().includes(termLower) || termLower.includes(w.toLowerCase()));

            if (!found) {
                diffs.push({
                    type: 'keyword',
                    expected: term,
                    message: `缺少关键词汇 "${term}"`
                });
            }
        });

        return diffs;
    }

    /**
     * 查找语义差异
     */
    findSemanticDiffs(user, reference, originalLang) {
        const diffs = [];

        // 检查是否遗漏了重要的修饰成分
        const modifiers = ['very', 'quite', 'rather', 'extremely', 'significantly', '非常', '相当', '极其', '显著'];

        modifiers.forEach(mod => {
            const inRef = reference.toLowerCase().includes(mod.toLowerCase());
            const inUser = user.toLowerCase().includes(mod.toLowerCase());

            if (inRef && !inUser) {
                diffs.push({
                    type: 'semantic',
                    expected: mod,
                    message: `遗漏了程度修饰 "${mod}"`
                });
            }
        });

        // 检查是否误解了某些词的含义
        const commonMistakes = this.getCommonMistakes(originalLang);
        commonMistakes.forEach(mistake => {
            const inUser = user.includes(mistake.from);
            if (inUser && !reference.includes(mistake.to)) {
                diffs.push({
                    type: 'semantic',
                    expected: mistake.to,
                    actual: mistake.from,
                    message: `"${mistake.from}" 可能应译为 "${mistake.to}"`
                });
            }
        });

        return diffs;
    }

    /**
     * 查找缺失的词汇
     */
    findMissingTerms(user, reference) {
        const missing = [];
        const userWords = this.tokenize(user).map(w => w.toLowerCase());
        const refWords = this.tokenize(reference);

        refWords.forEach(word => {
            const wordLower = word.toLowerCase();
            // 跳过标点和常见虚词
            if (this.isStopWord(word)) return;

            const found = userWords.some(uw =>
                uw === wordLower ||
                uw.includes(wordLower) ||
                wordLower.includes(uw)
            );

            if (!found && word.length > 1) {
                missing.push(word);
            }
        });

        // 只返回关键缺失词
        return missing.slice(0, 5).map(word => ({
            type: 'missing',
            term: word,
            message: `遗漏了 "${word}"`
        }));
    }

    /**
     * 查找多余的词汇
     */
    findExtraTerms(user, reference) {
        const extra = [];
        const userWords = this.tokenize(user).map(w => w.toLowerCase());
        const refWords = this.tokenize(reference).map(w => w.toLowerCase());

        userWords.forEach(word => {
            if (this.isStopWord(word)) return;
            if (word.length < 2) return;

            const found = refWords.some(rw =>
                rw === word ||
                rw.includes(word) ||
                word.includes(rw)
            );

            if (!found) {
                extra.push(word);
            }
        });

        return extra.slice(0, 5).map(word => ({
            type: 'extra',
            term: word,
            message: `多余或不必要的词汇 "${word}"`
        }));
    }

    /**
     * 生成改进建议
     */
    generateSuggestions(analysis, originalLang) {
        const suggestions = [];

        if (analysis.keywordDiffs.length > 0) {
            suggestions.push({
                category: '关键词',
                content: '请确保翻译包含原文中的关键概念和信息'
            });
        }

        if (analysis.semanticDiffs.length > 0) {
            suggestions.push({
                category: '语义准确性',
                content: '注意程度词和修饰成分，它们影响语义的精确性'
            });
        }

        if (analysis.missingTerms.length > 2) {
            suggestions.push({
                category: '完整性',
                content: '翻译可能遗漏了原文的部分信息，请仔细对照'
            });
        }

        if (analysis.extraTerms.length > 2) {
            suggestions.push({
                category: '准确性',
                content: '翻译中可能存在原文没有的信息，请避免过度解读'
            });
        }

        if (suggestions.length === 0) {
            suggestions.push({
                category: '优秀',
                content: '翻译质量较高，可以尝试更地道的中文表达'
            });
        }

        return suggestions;
    }

    /**
     * 提取关键术语
     */
    extractCriticalTerms(text) {
        // 提取长度>=3的实词
        const terms = this.tokenize(text).filter(term => {
            return term.length >= 3 && !this.isStopWord(term);
        });

        // 去重并返回
        return [...new Set(terms)];
    }

    /**
     * 分词
     */
    tokenize(text) {
        return text
            .replace(/[^\w\s\u4e00-\u9fa5]/g, ' ')
            .split(/\s+/)
            .filter(token => token.length > 0);
    }

    /**
     * 判断是否为停用词
     */
    isStopWord(word) {
        const stopWords = [
            'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with',
            'by', 'from', 'and', 'or', 'but', 'is', 'are', 'was', 'were',
            'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
            'will', 'would', 'could', 'should', 'may', 'might', 'must',
            'shall', 'can', 'need', 'dare', 'ought', 'used', 'the', '的',
            '了', '在', '是', '我', '有', '和', '就', '不', '人', '都',
            '一', '这', '那', '你', '他', '她', '它', '们', '与', '或'
        ];
        return stopWords.includes(word.toLowerCase());
    }

    /**
     * 获取常见错误翻译
     */
    getCommonMistakes(originalLang) {
        if (originalLang === 'en') {
            return [
                { from: '了解', to: 'understand/know' },
                { from: '学习', to: 'study/learn' },
                { from: '相信', to: 'believe' }
            ];
        } else {
            return [
                { from: 'like', to: '像' },
                { from: 'only', to: '只/仅仅' },
                { from: 'very', to: '非常' }
            ];
        }
    }

    /**
     * 计算文本相似度
     */
    calculateSimilarity(text1, text2) {
        const tokens1 = new Set(this.tokenize(text1.toLowerCase()));
        const tokens2 = new Set(this.tokenize(text2.toLowerCase()));

        const intersection = new Set([...tokens1].filter(x => tokens2.has(x)));
        const union = new Set([...tokens1, ...tokens2]);

        return intersection.size / union.size;
    }

    /**
     * 渲染Diff HTML
     */
    renderDiffHTML(analysis) {
        let html = '';

        // 渲染关键词差异
        if (analysis.keywordDiffs.length > 0) {
            html += '<div class="diff-section"><h4>关键词缺失</h4>';
            analysis.keywordDiffs.forEach(diff => {
                html += `<div class="diff-item">
                    <span class="diff-type keyword">关键词</span>
                    <span class="diff-text">${diff.message}</span>
                </div>`;
            });
            html += '</div>';
        }

        // 渲染语义差异
        if (analysis.semanticDiffs.length > 0) {
            html += '<div class="diff-section"><h4>语义偏差</h4>';
            analysis.semanticDiffs.forEach(diff => {
                html += `<div class="diff-item">
                    <span class="diff-type semantic">语义</span>
                    <span class="diff-text">${diff.message}</span>
                </div>`;
            });
            html += '</div>';
        }

        // 渲染缺失词汇
        if (analysis.missingTerms.length > 0) {
            html += '<div class="diff-section"><h4>遗漏信息</h4>';
            analysis.missingTerms.forEach(missing => {
                html += `<div class="diff-item">
                    <span class="diff-type keyword">遗漏</span>
                    <span class="diff-text">${missing.message}</span>
                </div>`;
            });
            html += '</div>';
        }

        // 渲染多余词汇
        if (analysis.extraTerms.length > 0) {
            html += '<div class="diff-section"><h4>多余信息</h4>';
            analysis.extraTerms.forEach(extra => {
                html += `<div class="diff-item">
                    <span class="diff-type semantic">多余</span>
                    <span class="diff-text">${extra.message}</span>
                </div>`;
            });
            html += '</div>';
        }

        // 渲染建议
        if (analysis.suggestions.length > 0) {
            html += '<div class="diff-section"><h4>改进建议</h4><ul>';
            analysis.suggestions.forEach(s => {
                html += `<li><strong>${s.category}:</strong> ${s.content}</li>`;
            });
            html += '</ul></div>';
        }

        return html || '<p class="empty-diff">未发现明显差异</p>';
    }
}

// 全局实例
const diffAnalyzer = new DiffAnalyzer();
