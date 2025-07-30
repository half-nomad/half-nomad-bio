// 노션 API 연동 모듈
// Half Nomad Blog - Notion Integration

class NotionBlogAPI {
    constructor(token, databaseId) {
        this.token = token;
        this.databaseId = databaseId;
        this.apiVersion = '2022-06-28';
        this.baseURL = 'https://api.notion.com/v1';
        
        // 캐시 설정 (5분)
        this.cache = new Map();
        this.cacheExpiry = 5 * 60 * 1000;
    }

    // API 호출 기본 헤더
    getHeaders() {
        return {
            'Authorization': `Bearer ${this.token}`,
            'Notion-Version': this.apiVersion,
            'Content-Type': 'application/json'
        };
    }

    // 캐시 키 생성
    getCacheKey(method, params = {}) {
        return `${method}_${JSON.stringify(params)}`;
    }

    // 캐시 확인
    getFromCache(key) {
        const cached = this.cache.get(key);
        if (cached && Date.now() - cached.timestamp < this.cacheExpiry) {
            console.log('📦 Cache hit:', key);
            return cached.data;
        }
        return null;
    }

    // 캐시 저장
    setCache(key, data) {
        this.cache.set(key, {
            data: data,
            timestamp: Date.now()
        });
    }

    // 발행된 포스트 목록 가져오기
    async getBlogPosts(limit = 50) {
        const cacheKey = this.getCacheKey('posts', { limit });
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            const response = await fetch(`${this.baseURL}/databases/${this.databaseId}/query`, {
                method: 'POST',
                headers: this.getHeaders(),
                body: JSON.stringify({
                    filter: {
                        property: 'Status',
                        select: { equals: 'Published' }
                    },
                    sorts: [
                        {
                            property: 'Published Date',
                            direction: 'descending'
                        }
                    ],
                    page_size: limit
                })
            });

            if (!response.ok) {
                throw new Error(`Notion API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const transformedPosts = data.results.map(page => this.transformPageToPost(page));
            
            this.setCache(cacheKey, transformedPosts);
            return transformedPosts;

        } catch (error) {
            console.error('❌ Error fetching blog posts:', error);
            throw error;
        }
    }

    // 특정 포스트의 상세 내용 가져오기
    async getPostContent(pageId) {
        const cacheKey = this.getCacheKey('content', { pageId });
        const cached = this.getFromCache(cacheKey);
        if (cached) return cached;

        try {
            // 페이지 블록 내용 가져오기
            const response = await fetch(`${this.baseURL}/blocks/${pageId}/children`, {
                method: 'GET',
                headers: this.getHeaders()
            });

            if (!response.ok) {
                throw new Error(`Notion API Error: ${response.status} ${response.statusText}`);
            }

            const data = await response.json();
            const htmlContent = await this.transformBlocksToHTML(data.results);
            
            this.setCache(cacheKey, htmlContent);
            return htmlContent;

        } catch (error) {
            console.error('❌ Error fetching post content:', error);
            throw error;
        }
    }

    // 노션 페이지 데이터를 블로그 포스트 형식으로 변환
    transformPageToPost(page) {
        const properties = page.properties;
        
        // 제목 추출
        const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';
        
        // 요약 추출
        const excerpt = properties.Excerpt?.rich_text?.[0]?.plain_text || '';
        
        // 카테고리 추출
        const categoryData = properties.Category?.select;
        const category = categoryData?.name?.toLowerCase().replace(/\s+/g, '-') || 'general';
        const categoryName = categoryData?.name || 'General';
        
        // 날짜 추출
        const publishedDate = properties['Published Date']?.date?.start || 
                            properties['Created time']?.created_time?.split('T')[0] || 
                            new Date().toISOString().split('T')[0];
        
        // 읽기 시간 추출 (기본값 5분)
        const readTime = properties['Read Time']?.number || 5;
        
        // 썸네일 추출
        const thumbnail = properties.Thumbnail?.rich_text?.[0]?.plain_text || '📝';

        return {
            id: page.id.replace(/-/g, ''), // 노션 ID에서 하이픈 제거
            notionId: page.id, // 원본 노션 ID 보관
            title: title,
            excerpt: excerpt,
            category: category,
            categoryName: categoryName,
            date: publishedDate,
            readTime: `${readTime}분`,
            thumbnail: thumbnail
        };
    }

    // 노션 블록을 HTML로 변환
    async transformBlocksToHTML(blocks) {
        let html = '';
        
        for (const block of blocks) {
            html += await this.transformBlockToHTML(block);
        }
        
        return html;
    }

    // 단일 블록을 HTML로 변환
    async transformBlockToHTML(block) {
        const type = block.type;
        
        switch (type) {
            case 'paragraph':
                const text = this.extractRichText(block.paragraph.rich_text);
                return text ? `<p>${text}</p>\n` : '';
                
            case 'heading_1':
                const h1Text = this.extractRichText(block.heading_1.rich_text);
                return `<h1>${h1Text}</h1>\n`;
                
            case 'heading_2':
                const h2Text = this.extractRichText(block.heading_2.rich_text);
                return `<h2>${h2Text}</h2>\n`;
                
            case 'heading_3':
                const h3Text = this.extractRichText(block.heading_3.rich_text);
                return `<h3>${h3Text}</h3>\n`;
                
            case 'bulleted_list_item':
                const liText = this.extractRichText(block.bulleted_list_item.rich_text);
                return `<li>${liText}</li>\n`;
                
            case 'numbered_list_item':
                const numText = this.extractRichText(block.numbered_list_item.rich_text);
                return `<li>${numText}</li>\n`;
                
            case 'quote':
                const quoteText = this.extractRichText(block.quote.rich_text);
                return `<blockquote>${quoteText}</blockquote>\n`;
                
            case 'code':
                const codeText = this.extractRichText(block.code.rich_text);
                const language = block.code.language || '';
                return `<pre><code class="${language}">${codeText}</code></pre>\n`;
                
            case 'divider':
                return '<hr>\n';
                
            case 'image':
                const imageUrl = block.image.external?.url || block.image.file?.url;
                const caption = this.extractRichText(block.image.caption);
                return imageUrl ? 
                    `<img src="${imageUrl}" alt="${caption}" style="max-width: 100%; height: auto;">\n` : '';
                
            default:
                // 지원하지 않는 블록 타입
                console.warn(`⚠️ Unsupported block type: ${type}`);
                return '';
        }
    }

    // Rich Text에서 일반 텍스트와 포맷팅 추출
    extractRichText(richTextArray) {
        if (!richTextArray || !Array.isArray(richTextArray)) return '';
        
        return richTextArray.map(textObj => {
            let text = textObj.plain_text || '';
            
            // 포맷팅 적용
            if (textObj.annotations) {
                const { bold, italic, strikethrough, underline, code } = textObj.annotations;
                
                if (code) text = `<code>${text}</code>`;
                if (bold) text = `<strong>${text}</strong>`;
                if (italic) text = `<em>${text}</em>`;
                if (strikethrough) text = `<del>${text}</del>`;
                if (underline) text = `<u>${text}</u>`;
            }
            
            // 링크 처리
            if (textObj.href) {
                text = `<a href="${textObj.href}" target="_blank" rel="noopener">${text}</a>`;
            }
            
            return text;
        }).join('');
    }

    // 포스트 리스트를 HTML 그룹핑 처리 (ul/ol 태그)
    postProcessHTML(html) {
        // 연속된 <li> 태그들을 <ul> 또는 <ol>로 감싸기
        html = html.replace(/(<li>.*?<\/li>\n)+/g, (match) => {
            return `<ul>\n${match}</ul>\n`;
        });
        
        // 빈 줄 정리
        html = html.replace(/\n\s*\n/g, '\n');
        
        return html.trim();
    }
}

// 전역 인스턴스 (토큰과 DB ID 설정 후 사용)
let notionAPI = null;

// API 초기화 함수
function initNotionAPI(token, databaseId) {
    notionAPI = new NotionBlogAPI(token, databaseId);
    console.log('✅ Notion API initialized');
    return notionAPI;
}

// 브라우저에서 사용할 수 있도록 전역 변수로 노출
if (typeof window !== 'undefined') {
    window.NotionBlogAPI = NotionBlogAPI;
    window.initNotionAPI = initNotionAPI;
    window.notionAPI = notionAPI;
}

// Node.js 환경에서 사용할 수 있도록 export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NotionBlogAPI,
        initNotionAPI
    };
}
