# 🚀 하프노마드 바이오그래피 웹페이지

> **현장에서 검증하고, 경험으로 가르칩니다** - AI와 로우코드 자동화 전문가 하프노마드의 개인 바이오그래피 랜딩페이지

## 🚨 **개발 시작 전 필수 체크 사항**
> **모든 작업 전에 반드시 확인해야 할 문서들**

### **📋 필수 참조 문서**
1. **[프로젝트 플랜](./project-plan.md)** ← 전체 프로젝트 구조 및 일정
2. **[디자인 시스템](./design-system.md)** ← 컬러, 타이포그래피, 컴포넌트 가이드
3. **작업 폴더**: `C:\Users\mokka\Claude-project\half_nomad_bio` (절대 변경 금지)

### **⚡ 개발 필수 원칙**
- 모든 컴포넌트는 **디자인 시스템** 컬러 팔레트 사용
- **모바일 우선** 반응형 설계 (320px부터)
- **바닐라 JS** 기반 (프레임워크 사용 금지)
- **성능 목표**: 로딩 3초 이내, Lighthouse 95+

---

## 📋 프로젝트 개요

### 🎯 목적
실제 사업 경험을 바탕으로 AI 및 로우코드 자동화 솔루션을 제공하는 하프노마드의 전문성과 신뢰성을 효과적으로 어필하여 **협업 제안으로 이어지는 고성능 바이오그래피 웹사이트** 제작

### 👥 타겟 오디언스
- AI/로우코드 자동화에 관심 있는 사업가
- 외식업, 부동산, 이커머스 업계 대표 
- 실전적인 비즈니스 솔루션을 찾는 기업

### 🛠 기술 스택
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **디자인**: 반응형 웹 디자인 (Mobile First)
- **애니메이션**: CSS Transitions + Intersection Observer API
- **최적화**: Critical CSS, Lazy Loading, WebP Images
- **배포**: Netlify/Vercel (정적 호스팅)

---

## 🎨 디자인 시스템

### 컬러 팔레트
> **상세 디자인 시스템**: [design-system.md](./design-system.md) 참조

**기본 브랜드 컬러**: Indigo Dye (#274060) 기반 5색상 블루 팔레트

### 핵심 디자인 원칙
- **전문성과 신뢰감**: 비즈니스 환경에 적합한 모던하고 깔끔한 디자인
- **스토리텔링**: 스크롤 기반으로 단계적 정보 전달
- **전환 최적화**: 명확한 CTA 배치와 사용자 여정 고려
- **모바일 우선**: 반응형 설계로 모든 디바이스 최적화

---

## 📐 페이지 구조

### 🏠 주요 섹션
1. **Hero Section** - 첫인상과 핵심 메시지 전달
2. **Problem & Solution** - 시장 문제 정의 및 해결책 제시  
3. **Core Expertise** - 3개 핵심 전문분야 소개
4. **My Approach** - 업무 철학 및 접근 방식
5. **What I Offer** - 구체적 서비스 및 프로그램
6. **Current Projects** - 현재 운영 중인 실제 사업들
7. **Portfolio Showcase** - Voice2Notion 등 개발 결과물
8. **Social Proof** - 팔로워, 브랜드 운영 등 신뢰 요소
9. **Final CTA** - 협업 제안 및 연락처

### 🎯 전환 최적화 전략
- **4단계 CTA 배치**: 관심유발 → 전문성 입증 → 신뢰구축 → 최종전환
- **신뢰도 구축**: 실제 운영 사업, 구체적 결과물, 소셜 프루프
- **명확한 가치 제안**: "현장에서 검증된 실전 방법" 강조

---

## 📊 성능 목표

### ⚡ 로딩 성능
- **First Contentful Paint**: < 1.8초
- **Time to Interactive**: < 3.8초
- **Cumulative Layout Shift**: < 0.1
- **모바일 Lighthouse 점수**: 95+

### 📱 사용자 경험
- **모바일 반응형**: 320px ~ 1920px 완벽 대응
- **접근성**: WCAG 2.1 AA 준수
- **크로스 브라우저**: Chrome, Firefox, Safari, Edge 호환

### 💼 비즈니스 지표
- **문의 전환율**: 3-5% 목표
- **평균 체류 시간**: 2분 이상
- **이탈률**: 40% 이하

---

## 🗂 폴더 구조

```
half_nomad_bio/
├── 📄 index.html                 # 메인 페이지
├── 📄 README.md                  # 프로젝트 문서
├── 📄 project-plan.md            # 상세 프로젝트 계획
│
├── 📁 assets/                    # 정적 자원
│   ├── 📁 css/
│   │   ├── main.css             # 메인 스타일시트
│   │   ├── components.css       # 컴포넌트별 스타일
│   │   └── responsive.css       # 반응형 스타일
│   │
│   ├── 📁 js/
│   │   ├── main.js             # 메인 JavaScript
│   │   ├── animations.js       # 애니메이션 로직
│   │   └── form.js             # 폼 처리 로직
│   │
│   ├── 📁 images/
│   │   ├── profile/            # 프로필 이미지
│   │   ├── icons/              # 아이콘 및 UI 요소
│   │   ├── portfolio/          # 포트폴리오 이미지
│   │   └── backgrounds/        # 배경 이미지
│   │
│   └── 📁 fonts/               # 웹폰트 (Pretendard)
│
├── 📁 components/               # HTML 컴포넌트 (개발용)
│   ├── hero.html
│   ├── expertise.html
│   ├── portfolio.html
│   └── cta.html
│
└── 📁 docs/                    # 추가 문서
    ├── design-system.md        # 디자인 시스템 가이드
    ├── deployment.md           # 배포 가이드
    └── content-guide.md        # 콘텐츠 작성 가이드
```

---

## 🚀 개발 진행 상황

> **상세한 작업 현황**: [docs/work-log.md](./docs/work-log.md) 참조

### ✅ 현재 완성도: **약 35%**
- **Phase 1**: 100% 완료 (프로젝트 구조, CSS 프레임워크, 그리드 시스템)
- **Phase 2**: 40% 진행 (Hero Section 완성, JavaScript 시스템)

### 🎯 다음 우선 작업
**Core Expertise 섹션 완성** - 3개 전문분야 카드 시스템 구현

### 📁 완성된 주요 파일
- `index.html` (1,188줄) - 완전한 HTML 구조
- `assets/css/` (4개 파일) - CSS 프레임워크 완성
- `assets/js/main.js` (12KB) - 애니메이션 시스템

---

## 🛠 설치 및 실행

### 필요 조건
- 웹브라우저 (Chrome, Firefox, Safari, Edge)
- 로컬 서버 (Live Server, Python HTTP Server 등)

### 로컬 개발환경 실행
```bash
# 프로젝트 폴더로 이동
cd C:\Users\mokka\Claude-project\half_nomad_bio

# 로컬 서버 실행 (VS Code Live Server 또는)
python -m http.server 8000

# 브라우저에서 접속
http://localhost:8000
```

### 배포
```bash
# Netlify 배포 (권장)
1. GitHub 저장소에 푸시
2. Netlify에서 저장소 연결
3. 자동 배포 설정

# 또는 Vercel 배포
1. Vercel CLI 설치: npm i -g vercel
2. 프로젝트 폴더에서: vercel
3. 배포 완료
```

---

## 📞 연락처 및 협업

### 🤝 협업 제안
**이메일**: Mokka@half-nomad.com  
**SNS**: [@half.nomad](https://www.threads.com/@half.nomad) (Threads)

### 🛠 기술 문의
이 프로젝트와 관련된 기술적 문의나 개선 제안은 언제든 환영합니다.

### 🎯 협업 분야
- AI 바이브코딩 교육 프로그램
- 로우코드 자동화 컨설팅
- 노션 IDEA 워크프레임 구축
- 맞춤형 비즈니스 솔루션 개발

---

## 📚 참고 자료

### 🔗 관련 프로젝트
- [Voice2Notion](https://voice2notion.xyz/) - 음성을 노션에 자동 저장하는 웹앱
- [노션 IDEA 워크프레임](https://half-nomad.github.io/Notion-PPT/) - 지식관리 시스템

### 📖 기술 문서
- [Pretendard 폰트](https://github.com/orioncactus/pretendard)
- [CSS Grid Guide](https://css-tricks.com/snippets/css/complete-guide-grid/)
- [Intersection Observer API](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API)

---

## 📄 라이선스
이 프로젝트는 개인 포트폴리오 목적으로 제작되었습니다.

---

**🎯 프로젝트 목표**: "이론이 아닌 실전, 혼자가 아닌 함께" - 하프노마드

> 현장에서 검증된 AI와 로우코드 자동화 솔루션을 통해 함께 성장할 협업 파트너를 찾습니다.
