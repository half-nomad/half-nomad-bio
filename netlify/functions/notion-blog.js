// Netlify Functions - 노션 API 프록시
// 파일: netlify/functions/notion-blog.js

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

    try {
        // 환경 변수에서 노션 설정 가져오기
        const notion = new Client({ 
            auth: process.env.NOTION_TOKEN 
        });
        
        const databaseId = process.env.NOTION_DATABASE_ID || '23a091314f8f80d9a84fe29e3c59f88d';
        
        // 발행된 포스트만 가져오기
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

        // 데이터 변환
        const posts = response.results.map(page => {
            const properties = page.properties;
            
            return {
                id: page.id.replace(/-/g, ''),
                notionId: page.id,
                title: properties.Title?.title?.[0]?.plain_text || 'Untitled',
                excerpt: properties.Excerpt?.rich_text?.[0]?.plain_text || '',
                category: properties.Category?.select?.name?.toLowerCase().replace(/\s+/g, '-') || 'general',
                categoryName: properties.Category?.select?.name || 'General',
                date: properties['Published Date']?.date?.start || new Date().toISOString().split('T')[0],
                readTime: `${properties['Read Time']?.number || 5}분`,
                thumbnail: properties.Thumbnail?.rich_text?.[0]?.plain_text || '📝'
            };
        });

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                posts: posts,
                count: posts.length
            })
        };

    } catch (error) {
        console.error('노션 API 오류:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message,
                fallback: true
            })
        };
    }
};
