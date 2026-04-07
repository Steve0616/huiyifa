/**
 * llm.js - AI判断模块
 * 支持硅基流动和DeepSeek免费API
 */

class LLMJudge {
    constructor() {
        this.provider = 'siliconflow'; // 默认硅基流动
        this.apiKey = 'sk-szpmnjoncjhqwemdsazxtbteikaoqauzgkycynzefjdkawfw'; // 默认API Key
        this.model = 'Qwen/Qwen2.5-7B-Instruct'; // 硅基流动默认模型
        
        // 模型映射
        this.models = {
            siliconflow: 'Qwen/Qwen2.5-7B-Instruct',
            deepseek: 'deepseek-chat'
        };
        
        // API地址
        this.endpoints = {
            siliconflow: 'https://api.siliconflow.cn/v1/chat/completions',
            deepseek: 'https://api.deepseek.com/v1/chat/completions'
        };
    }

    /**
     * 配置API
     */
    configure(provider, apiKey) {
        this.provider = provider;
        this.apiKey = apiKey;
        this.model = this.models[provider] || this.models.siliconflow;
    }

    /**
     * 获取API配置
     */
    loadConfig() {
        const saved = localStorage.getItem('llm_config');
        if (saved) {
            const config = JSON.parse(saved);
            this.provider = config.provider || 'siliconflow';
            this.apiKey = config.apiKey || '';
            this.model = this.models[this.provider] || this.models.siliconflow;
            return config;
        }
        return null;
    }

    /**
     * 保存API配置
     */
    saveConfig(provider, apiKey) {
        const config = { provider, apiKey };
        localStorage.setItem('llm_config', JSON.stringify(config));
        this.configure(provider, apiKey);
    }

    /**
     * 清空API配置
     */
    clearConfig() {
        localStorage.removeItem('llm_config');
        this.apiKey = '';
    }

    /**
     * 检查是否已配置
     */
    isConfigured() {
        return !!this.apiKey;
    }

    /**
     * 判断翻译质量
     */
    async judgeTranslation(userTranslation, referenceTranslation, originalText, originalLang) {
        if (!this.isConfigured()) {
            return { error: '请先在设置中配置API Key' };
        }

        const direction = originalLang === 'en' ? '英译中' : '中译英';
        
        const prompt = `你是一个翻译质量评估专家。请评估用户的翻译质量。

原文: ${originalText}
参考译文: ${referenceTranslation}
用户译文: ${userTranslation}

请从以下维度评估:
1. 准确性 - 译文是否准确传达原文意思
2. 流畅性 - 译文是否自然流畅
3. 完整性 - 是否遗漏重要信息
4. 专业性 - 用词是否恰当

请给出:
1. 评分(0-100分)
2. 简要评价(1-2句话)
3. 主要问题(如果有)

请用JSON格式返回:
{
    "score": 数字,
    "feedback": "评价文字",
    "issues": ["问题1", "问题2"]
}`;

        try {
            const response = await this.callAPI(prompt);
            return this.parseResponse(response);
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * 判断回译质量
     */
    async judgeBackTranslation(userBackTranslation, originalText, originalLang) {
        if (!this.isConfigured()) {
            return { error: '请先在设置中配置API Key' };
        }

        const direction = originalLang === 'en' ? '中译英' : '英译中';
        
        const prompt = `你是一个翻译质量评估专家。请评估用户的回译质量。

回译是将译文再翻译回原文语言，这是检验翻译是否准确的重要方法。

原文: ${originalText}
用户的回译: ${userBackTranslation}

请评估回译是否还原了原文的核心含义:

请给出:
1. 还原度评分(0-100分) - 回译是否保留了原文关键信息
2. 简要评价(1-2句话)

请用JSON格式返回:
{
    "score": 数字,
    "feedback": "评价文字"
}`;

        try {
            const response = await this.callAPI(prompt);
            return this.parseResponse(response);
        } catch (error) {
            return { error: error.message };
        }
    }

    /**
     * 调用LLM API
     */
    async callAPI(prompt) {
        const endpoint = this.endpoints[this.provider];
        
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.apiKey}`
            },
            body: JSON.stringify({
                model: this.model,
                messages: [
                    { role: 'system', content: '你是一个专业的翻译质量评估专家。请严格按JSON格式输出评估结果。' },
                    { role: 'user', content: prompt }
                ],
                temperature: 0.3,
                max_tokens: 500
            })
        });

        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.error?.message || `API请求失败: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0].message.content;
    }

    /**
     * 解析API响应
     */
    parseResponse(response) {
        try {
            // 尝试提取JSON
            const jsonMatch = response.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                const result = JSON.parse(jsonMatch[0]);
                return {
                    score: result.score / 100, // 转换为0-1
                    feedback: result.feedback,
                    issues: result.issues || []
                };
            }
        } catch (e) {
            // 解析失败，返回原始响应作为反馈
        }
        
        // 尝试从文本中提取分数
        const scoreMatch = response.match(/(\d+)\s*分/);
        const score = scoreMatch ? parseInt(scoreMatch[1]) / 100 : 0.5;
        
        return {
            score: score,
            feedback: response.substring(0, 200),
            issues: []
        };
    }

    /**
     * 测试API连接
     */
    async testConnection() {
        if (!this.apiKey) {
            return { success: false, message: '请先输入API Key' };
        }

        try {
            const response = await this.callAPI('请回复"OK"');
            if (response.includes('OK') || response.toLowerCase().includes('ok')) {
                return { success: true, message: '连接成功!' };
            }
            return { success: true, message: 'API响应正常' };
        } catch (error) {
            return { success: false, message: error.message };
        }
    }
}

// 全局实例
const llmJudge = new LLMJudge();

// 加载保存的配置
llmJudge.loadConfig();