// Netlify Function - 노션 버튼 웹훅 처리
// 파일: netlify/functions/notion-webhook.js

const { Client } = require('@notionhq/client');

exports.handler = async (event, context) => {
    // CORS 헤더 설정
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Preflight 요청 처리
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // POST 요청만 처리
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers,
            body: JSON.stringify({ error: 'Method Not Allowed' })
        };
    }

    try {
        console.log('🚀 노션 웹훅 수신:', event.body);

        // 환경 변수 확인
        const notionToken = process.env.NOTION_TOKEN;
        const githubToken = process.env.GITHUB_TOKEN;
        const databaseId = process.env.NOTION_DATABASE_ID || '23a091314f8f80d9a84fe29e3c59f88d';

        if (!notionToken) {
            throw new Error('NOTION_TOKEN 환경 변수가 설정되지 않았습니다.');
        }

        if (!githubToken) {
            throw new Error('GITHUB_TOKEN 환경 변수가 설정되지 않았습니다.');
        }

        // 노션 클라이언트 초기화
        const notion = new Client({ auth: notionToken });

        // 1. 노션에서 발행된 포스트 가져오기
        console.log('📡 노션에서 포스트 데이터 가져오는 중...');
        const response = await notion.databases.query({
            database_id: databaseId,
            filter: {
                property: 'Status',
                select: { equals: 'Published' }
            },
            sorts: [
                {
                    property: 'Published Date',
                    direction: 'descending'
                }
            ]
        });

        // 2. 포스트 데이터 변환
        const posts = [];
        for (const page of response.results) {
            const postData = await transformNotionPage(notion, page);
            posts.push(postData);
        }

        console.log(`✅ ${posts.length}개의 포스트 변환 완료`);

        // 3. blog-data.json 형태로 구성
        const blogData = {
            posts: posts,
            lastUpdated: new Date().toISOString(),
            version: "1.0.0",
            source: "notion-webhook"
        };

        // 4. GitHub에 업데이트
        const updateResult = await updateGitHubFile(githubToken, blogData);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                message: `✅ 블로그 업데이트 완료! ${posts.length}개 포스트 동기화`,
                posts: posts.length,
                lastUpdated: blogData.lastUpdated,
                githubCommit: updateResult.commit.sha
            })
        };

    } catch (error) {
        console.error('❌ 웹훅 처리 오류:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                timestamp: new Date().toISOString()
            })
        };
    }
};

// 노션 페이지를 블로그 포스트 형태로 변환
async function transformNotionPage(notion, page) {
    const properties = page.properties;
    
    // 기본 메타데이터 추출
    const title = properties.Title?.title?.[0]?.plain_text || 'Untitled';
    const excerpt = properties.Excerpt?.rich_text?.[0]?.plain_text || '';
    const categoryData = properties.Category?.select;
    const category = categoryData?.name?.toLowerCase().replace(/\s+/g, '-') || 'general';
    const categoryName = categoryData?.name || 'General';
    const publishedDate = properties['Published Date']?.date?.start || new Date().toISOString().split('T')[0];
    const readTime = `${properties['Read Time']?.number || 5}분`;
    const thumbnail = properties.Thumbnail?.rich_text?.[0]?.plain_text || '📝';

    // 페이지 콘텐츠 가져오기
    let content = '';
    try {
        const blocks = await notion.blocks.children.list({
            block_id: page.id,
            page_size: 100
        });
        
        content = await transformBlocksToHTML(notion, blocks.results);
    } catch (error) {
        console.warn(`⚠️ 페이지 ${page.id} 콘텐츠 로드 실패:`, error.message);
        content = '<p>콘텐츠를 불러올 수 없습니다.</p>';
    }

    return {
        id: page.id.replace(/-/g, ''),
        notionId: page.id,
        title: title,
        excerpt: excerpt,
        category: category,
        categoryName: categoryName,
        date: publishedDate,
        readTime: readTime,
        thumbnail: thumbnail,
        content: content
    };
}

// 노션 블록을 HTML로 변환
async function transformBlocksToHTML(notion, blocks) {
    let html = '';
    
    for (const block of blocks) {
        html += transformBlockToHTML(block);
    }
    
    return html.trim();
}

// 단일 블록을 HTML로 변환
function transformBlockToHTML(block) {
    const type = block.type;
    
    switch (type) {
        case 'paragraph':
            const text = extractRichText(block.paragraph.rich_text);
            return text ? `<p>${text}</p>\n` : '';
            
        case 'heading_1':
            const h1Text = extractRichText(block.heading_1.rich_text);
            return `<h2>${h1Text}</h2>\n`;
            
        case 'heading_2':
            const h2Text = extractRichText(block.heading_2.rich_text);
            return `<h3>${h2Text}</h3>\n`;
            
        case 'heading_3':
            const h3Text = extractRichText(block.heading_3.rich_text);
            return `<h4>${h3Text}</h4>\n`;
            
        case 'bulleted_list_item':
            const liText = extractRichText(block.bulleted_list_item.rich_text);
            return `<li>${liText}</li>\n`;
            
        case 'numbered_list_item':
            const numText = extractRichText(block.numbered_list_item.rich_text);
            return `<li>${numText}</li>\n`;
            
        case 'quote':
            const quoteText = extractRichText(block.quote.rich_text);
            return `<blockquote>${quoteText}</blockquote>\n`;
            
        case 'code':
            const codeText = extractRichText(block.code.rich_text);
            const language = block.code.language || '';
            return `<pre><code class="${language}">${escapeHtml(codeText)}</code></pre>\n`;
            
        case 'divider':
            return '<hr>\n';
            
        default:
            return '';
    }
}

// Rich Text에서 HTML 추출
function extractRichText(richTextArray) {
    if (!richTextArray || !Array.isArray(richTextArray)) return '';
    
    return richTextArray.map(textObj => {
        let text = textObj.plain_text || '';
        
        // HTML 이스케이프
        text = escapeHtml(text);
        
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

// HTML 이스케이프
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}

// GitHub 파일 업데이트
async function updateGitHubFile(githubToken, blogData) {
    const owner = 'half-nomad';
    const repo = 'half-nomad-bio';
    const path = 'blog-data.json';
    const content = JSON.stringify(blogData, null, 2);
    
    // 현재 파일 정보 가져오기 (SHA 필요)
    let currentFileSha = null;
    try {
        const currentFile = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
            headers: {
                'Authorization': `token ${githubToken}`,
                'User-Agent': 'Half-Nomad-Blog-Webhook'
            }
        });
        
        if (currentFile.ok) {
            const fileData = await currentFile.json();
            currentFileSha = fileData.sha;
        }
    } catch (error) {
        console.log('📄 새 파일 생성 (기존 파일 없음)');
    }
    
    // 파일 업데이트 또는 생성
    const updatePayload = {
        message: `🚀 블로그 포스트 자동 업데이트 (${blogData.posts.length}개 포스트)\n\n노션 웹훅을 통해 자동 동기화됨\n업데이트: ${blogData.lastUpdated}`,
        content: Buffer.from(content).toString('base64'),
        branch: 'main'
    };
    
    if (currentFileSha) {
        updatePayload.sha = currentFileSha;
    }
    
    const response = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${path}`, {
        method: 'PUT',
        headers: {
            'Authorization': `token ${githubToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'Half-Nomad-Blog-Webhook'
        },
        body: JSON.stringify(updatePayload)
    });
    
    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`GitHub API 오류: ${response.status} ${errorData}`);
    }
    
    return await response.json();
}
