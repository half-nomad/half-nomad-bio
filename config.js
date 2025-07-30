// 노션 API 설정
// ⚠️ 보안 주의: 이 파일은 절대 public 저장소에 업로드하지 마세요!
// .gitignore에 추가하여 버전 관리에서 제외하세요.

const NOTION_CONFIG = {
    // Integration Token (secret_으로 시작)
    API_TOKEN: 'ntn_Y24359279513pKlRBKWhw75wdKn3FManCgX9wsxi0NCbc6',
    
    // 블로그 데이터베이스 ID
    DATABASE_ID: '23a091314f8f80d9a84fe29e3c59f88d',
    
    // 캐시 설정 (분 단위)
    CACHE_TTL: 5,
    
    // API 호출 제한
    MAX_POSTS: 50,
    
    // 개발 모드 (true면 상세 로그 출력)
    DEBUG_MODE: true
};

// 설정 검증
function validateConfig() {
    if (!NOTION_CONFIG.API_TOKEN || NOTION_CONFIG.API_TOKEN === 'YOUR_NOTION_TOKEN_HERE') {
        console.error('❌ Notion API Token이 설정되지 않았습니다.');
        console.log('📝 설정 방법:');
        console.log('1. https://www.notion.so/my-integrations 접속');
        console.log('2. Integration 생성 후 Token 복사');
        console.log('3. config.js 파일의 API_TOKEN 값 변경');
        return false;
    }
    
    if (!NOTION_CONFIG.DATABASE_ID) {
        console.error('❌ Database ID가 설정되지 않았습니다.');
        return false;
    }
    
    console.log('✅ Notion 설정이 유효합니다.');
    return true;
}

// 브라우저 환경에서 사용
if (typeof window !== 'undefined') {
    window.NOTION_CONFIG = NOTION_CONFIG;
    window.validateConfig = validateConfig;
}

// Node.js 환경에서 사용
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        NOTION_CONFIG,
        validateConfig
    };
}
