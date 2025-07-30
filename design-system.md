# 🎨 하프노마드 바이오그래피 - 디자인 시스템 가이드

> **모든 UI/UX 작업 전에 반드시 참조해야 하는 디자인 시스템 문서**

## 🚨 **필수 준수 사항**
**모든 개발 작업 시 이 디자인 시스템을 먼저 확인하고 진행할 것!**

---

## 🎨 컬러 시스템 (필수)

### **기본 컬러 팔레트**
```css
:root {
    /* 브랜드 컬러 (반드시 사용) */
    --primary: #274060;        /* Indigo Dye - 메인 브랜드 */
    --secondary: #335c81;      /* Lapis Lazuli - 섹션 배경 */
    --accent: #65afff;         /* Argentinian Blue - CTA, 강조 */
    --tertiary: #1b2845;       /* Space Cadet - 다크 배경 */
    --highlight: #5899e2;      /* United Nations Blue - 호버, 액티브 */
    
    /* 배경 컬러 */
    --bg-primary: #1a1a1a;    /* 메인 배경 */
    --bg-secondary: #274060;   /* 섹션 배경 */
    --bg-card: rgba(255, 255, 255, 0.05); /* 카드 배경 */
    
    /* 텍스트 컬러 */
    --text-primary: #FFFFFF;   /* 기본 텍스트 */
    --text-secondary: #CCCCCC; /* 서브 텍스트 */
    --text-muted: #999999;     /* 보조 텍스트 */
}
```

### **컬러 사용 가이드**
- **Primary (#274060)**: 메인 헤딩, 로고, 주요 브랜드 요소
- **Secondary (#335c81)**: 섹션 구분, 카드 배경
- **Accent (#65afff)**: CTA 버튼, 링크, 강조 요소
- **Highlight (#5899e2)**: 호버 상태, 액티브 상태

### **그라데이션 시스템**
```css
/* 헤드라인 그라데이션 */
.gradient-headline {
    background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

/* CTA 버튼 그라데이션 */
.gradient-cta {
    background: linear-gradient(90deg, var(--accent) 0%, var(--highlight) 100%);
}

/* 배경 그라데이션 */
.gradient-bg {
    background: linear-gradient(135deg, var(--tertiary) 0%, var(--primary) 100%);
}
```

---

## ✍️ 타이포그래피 시스템

### **폰트 설정 (필수)**
```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.css');

body {
    font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, sans-serif;
    font-feature-settings: "tnum", "ss01", "ss02";
}
```

### **텍스트 계층 구조**
```css
/* 메인 헤드라인 */
.headline {
    font-size: clamp(2.5rem, 6vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 1.5rem;
}

/* 섹션 제목 */
.section-title {
    font-size: clamp(2rem, 5vw, 3rem);
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 1.2rem;
}

/* 서브 헤딩 */
.sub-heading {
    font-size: clamp(1.5rem, 4vw, 2rem);
    font-weight: 600;
    line-height: 1.3;
    margin-bottom: 1rem;
}

/* 본문 강조 */
.body-emphasis {
    font-size: clamp(1.1rem, 3vw, 1.3rem);
    font-weight: 600;
    line-height: 1.5;
}

/* 본문 기본 */
.body-text {
    font-size: clamp(1rem, 2.5vw, 1.1rem);
    font-weight: 400;
    line-height: 1.7;
    color: var(--text-secondary);
}

/* 캡션/메타 */
.caption {
    font-size: clamp(0.875rem, 2vw, 0.95rem);
    font-weight: 500;
    color: var(--text-muted);
}
```

---

## 📐 레이아웃 시스템

### **컨테이너 및 그리드 (완성됨)**
> **구현 파일**: `assets/css/grid-system.css` (18KB)

```css
/* 메인 컨테이너 */
.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 1rem;
}

/* 반응형 그리드 시스템 */
.grid-auto-fit {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 2rem;
}

.card-grid {
    display: grid;
    gap: var(--spacing-lg);
    grid-template-columns: 1fr;
}

@media (min-width: 768px) {
    .card-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (min-width: 1024px) {
    .card-grid { grid-template-columns: repeat(3, 1fr); }
}

/* 완성된 유틸리티 클래스들 */
.hero-layout, .split-layout, .flex, .gap-*, .mb-*, .hide-mobile
```

### **브레이크포인트 시스템 (구현 완료)**
```css
/* 모바일 우선 접근 */
320px~767px:   1컬럼 (모바일)
768px~1023px:  2컬럼 (태블릿)  
1024px~1199px: 3-4컬럼 (데스크톱)
1200px+:       최적화된 여백 (와이드)
```

### **간격 시스템**
```css
:root {
    --spacing-xs: 0.5rem;
    --spacing-sm: 1rem;
    --spacing-md: 1.5rem;
    --spacing-lg: 2rem;
    --spacing-xl: 3rem;
    --spacing-xxl: 4rem;
}
```

---

## 🧩 컴포넌트 라이브러리

### **1. Hero Section 컴포넌트 (완성됨)**
> **구현 상태**: 100% 완료 - `components.css`에서 확인 가능

```css
/* Hero 섹션 완성 요소들 */
.section-hero {
    background: linear-gradient(135deg, var(--bg-primary), var(--tertiary), var(--primary));
}

.profile-image {
    width: 120px;
    height: 120px;
    border: 4px solid transparent;
    background: var(--gradient-cta);
    border-radius: 50%;
}

.stats-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 1.5rem;
}

.brand-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}

.scroll-indicator {
    animation: bounce 2s infinite;
}
```

**완성된 기능들:**
- 프로필 이미지 + 그라데이션 테두리
- 통계 카드 3개 (그라데이션 숫자)
- 브랜드 태그 4개 (모카팩토리, 하프노마드, 미친양꼬치, 지피터스)
- 스크롤 인디케이터 + 바운스 애니메이션

### **2. CTA 버튼 (완성됨)**
```css
.cta-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 1rem 2rem;
    background: var(--gradient-cta);
    color: white;
    text-decoration: none;
    border: none;
    border-radius: 50px;
    font-weight: 600;
    font-size: 1.1rem;
    transition: all 0.3s ease;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(101, 175, 255, 0.3);
}

.cta-button:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 25px rgba(101, 175, 255, 0.4);
}

.cta-button-secondary {
    background: transparent;
    border: 2px solid var(--accent);
    color: var(--accent);
}
```

### **2. 카드 컴포넌트**
```css
.card {
    background: var(--bg-card);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 16px;
    padding: 2rem;
    backdrop-filter: blur(10px);
    transition: all 0.3s ease;
}

.card:hover {
    transform: translateY(-5px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    border-color: rgba(101, 175, 255, 0.3);
}

.card-title {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--text-primary);
}

.card-description {
    color: var(--text-secondary);
    line-height: 1.6;
}
```

### **3. 강조 박스**
```css
.highlight-box {
    background: rgba(101, 175, 255, 0.1);
    border: 1px solid rgba(101, 175, 255, 0.3);
    border-radius: 12px;
    padding: 2rem;
    margin: var(--spacing-lg) 0;
    position: relative;
}

.highlight-box::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: var(--gradient-cta);
    border-radius: 12px 12px 0 0;
}
```

### **4. 아이콘 박스**
```css
.icon-box {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 80px;
    height: 80px;
    background: var(--gradient-cta);
    border-radius: 20px;
    margin-bottom: 1.5rem;
    font-size: 2rem;
}
```

---

## 🎭 애니메이션 시스템

### **기본 트랜지션**
```css
* {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### **스크롤 애니메이션**
```css
.fade-in {
    opacity: 0;
    transform: translateY(30px);
    transition: all 0.6s ease;
}

.fade-in.visible {
    opacity: 1;
    transform: translateY(0);
}

.slide-in-left {
    opacity: 0;
    transform: translateX(-50px);
    transition: all 0.6s ease;
}

.slide-in-left.visible {
    opacity: 1;
    transform: translateX(0);
}
```

### **호버 효과**
```css
.hover-lift {
    transition: transform 0.3s ease;
}

.hover-lift:hover {
    transform: translateY(-5px);
}

.hover-glow:hover {
    box-shadow: 0 0 20px rgba(101, 175, 255, 0.5);
}
```

---

## 📱 반응형 브레이크포인트

```css
/* Mobile First 접근 */
@media (min-width: 480px) {
    /* 큰 모바일 */
}

@media (min-width: 768px) {
    /* 태블릿 */
}

@media (min-width: 1024px) {
    /* 데스크톱 */
}

@media (min-width: 1200px) {
    /* 큰 데스크톱 */
}
```

---

## 🎯 전환율 최적화 UI 가이드

### **CTA 배치 원칙**
1. **첫 화면**: Hero Section 내 primary CTA
2. **중간 섹션**: 각 전문분야 소개 후 secondary CTA
3. **포트폴리오**: 실제 결과물 후 project CTA
4. **최종**: 페이지 하단 main contact CTA

### **신뢰도 UI 요소**
```css
.trust-badge {
    display: inline-flex;
    align-items: center;
    padding: 0.5rem 1rem;
    background: rgba(88, 153, 226, 0.2);
    border-radius: 20px;
    font-size: 0.9rem;
    color: var(--highlight);
}

.social-proof {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    color: var(--text-muted);
    font-size: 0.9rem;
}
```

---

## 🔧 개발 체크리스트

### **모든 컴포넌트 개발 시 확인사항**
- [ ] 컬러 팔레트 변수 사용 확인
- [ ] 반응형 디자인 적용 확인
- [ ] 접근성 (aria-label, role) 추가
- [ ] 호버/포커스 상태 정의
- [ ] 로딩 성능 고려 (이미지 최적화 등)

### **섹션별 필수 요소**
- **Hero**: gradient-headline, cta-button, fade-in 애니메이션
- **Expertise**: 3개 card 컴포넌트, icon-box, hover-lift
- **Portfolio**: highlight-box, trust-badge, 외부 링크 스타일
- **CTA**: gradient-cta 버튼, social-proof 요소

---

## 📋 사용 예시

```html
<!-- 올바른 컴포넌트 사용 예시 -->
<section class="section">
    <div class="container">
        <h2 class="section-title gradient-headline">Core Expertise</h2>
        <div class="grid grid-3">
            <div class="card hover-lift fade-in">
                <div class="icon-box">🤖</div>
                <h3 class="card-title">AI 바이브 마케팅</h3>
                <p class="card-description">실제 사업에서 검증된 방법만 가르칩니다</p>
                <a href="#" class="cta-button-secondary">더 알아보기</a>
            </div>
        </div>
    </div>
</section>
```

---

**🎯 디자인 원칙**: "전문성 + 신뢰감 + 전환 최적화"  
**⚡ 성능 목표**: "3초 이내 로딩 + 95+ Lighthouse 점수"  
**📱 우선순위**: "모바일 First → 데스크톱 확장"
