// 로컬 테스트용 노션 연동 스크립트
// 실행: node test-notion-connection.mjs

import { Client } from '@notionhq/client';

async function testNotionConnection() {
  try {
    console.log('🔍 노션 연결 테스트 시작...');
    
    // 환경 변수 확인
    const token = process.env.NOTION_TOKEN;
    const databaseId = process.env.NOTION_DATABASE_ID;
    
    if (!token) {
      console.log('❌ NOTION_TOKEN 환경 변수가 설정되지 않았습니다.');
      console.log('💡 설정 방법:');
      console.log('   Windows: set NOTION_TOKEN=your_token_here');
      console.log('   Mac/Linux: export NOTION_TOKEN=your_token_here');
      return;
    }
    
    if (!databaseId) {
      console.log('❌ NOTION_DATABASE_ID 환경 변수가 설정되지 않았습니다.');
      console.log('💡 설정 방법:');
      console.log('   Windows: set NOTION_DATABASE_ID=your_database_id_here');
      console.log('   Mac/Linux: export NOTION_DATABASE_ID=your_database_id_here');
      return;
    }
    
    console.log(`✅ 토큰 길이: ${token.length} 문자`);
    console.log(`✅ 데이터베이스 ID: ${databaseId}`);
    
    // 노션 클라이언트 초기화
    const notion = new Client({ auth: token });
    
    // 1. 데이터베이스 정보 확인
    console.log('\n📋 데이터베이스 정보 조회 중...');
    const database = await notion.databases.retrieve({
      database_id: databaseId
    });
    
    console.log(`✅ 데이터베이스명: ${database.title[0]?.plain_text || 'Untitled'}`);
    console.log(`📊 생성일: ${database.created_time}`);
    console.log(`🔄 수정일: ${database.last_edited_time}`);
    
    // 2. 데이터베이스 속성 확인
    console.log('\n🏷️ 데이터베이스 속성:');
    Object.entries(database.properties).forEach(([name, prop]) => {
      console.log(`   ${name}: ${prop.type}`);
    });
    
    // 3. 페이지 목록 조회 (최대 5개)
    console.log('\n📚 페이지 목록 조회 중...');
    const pages = await notion.databases.query({
      database_id: databaseId,
      page_size: 5
    });
    
    console.log(`📊 총 페이지 수: ${pages.results.length}`);
    
    if (pages.results.length === 0) {
      console.log('⚠️ 데이터베이스에 페이지가 없습니다.');
    } else {
      pages.results.forEach((page, index) => {
        const title = page.properties.Title?.title?.[0]?.plain_text || 'Untitled';
        const status = page.properties.Status?.select?.name || 'No Status';
        console.log(`   ${index + 1}. "${title}" - ${status}`);
      });
    }
    
    // 4. 발행된 페이지만 조회
    console.log('\n🚀 발행된 페이지 조회 중...');
    const publishedPages = await notion.databases.query({
      database_id: databaseId,
      filter: {
        property: 'Status',
        select: { equals: 'Published' }
      }
    });
    
    console.log(`📊 발행된 페이지 수: ${publishedPages.results.length}`);
    
    if (publishedPages.results.length === 0) {
      console.log('⚠️ Status가 "Published"인 페이지가 없습니다.');
      console.log('💡 노션에서 Status 속성을 "Published"로 설정해주세요.');
    } else {
      publishedPages.results.forEach((page, index) => {
        const title = page.properties.Title?.title?.[0]?.plain_text || 'Untitled';
        const date = page.properties['Published Date']?.date?.start || 'No Date';
        console.log(`   ${index + 1}. "${title}" - ${date}`);
      });
    }
    
    console.log('\n🎉 노션 연결 테스트 완료!');
    
  } catch (error) {
    console.error('❌ 연결 테스트 실패:', error.message);
    
    if (error.code === 'unauthorized') {
      console.log('💡 인증 오류 - NOTION_TOKEN을 확인해주세요.');
    } else if (error.code === 'object_not_found') {
      console.log('💡 데이터베이스를 찾을 수 없습니다 - NOTION_DATABASE_ID를 확인해주세요.');
    } else if (error.code === 'forbidden') {
      console.log('💡 권한 오류 - 노션 페이지에 integration을 추가했는지 확인해주세요.');
    }
    
    console.log('\n🔧 해결 방법:');
    console.log('1. 노션에서 Integration 생성 및 토큰 발급');
    console.log('2. 데이터베이스 페이지에서 Integration 연결');
    console.log('3. 환경 변수 올바르게 설정');
  }
}

// 실행
testNotionConnection();
