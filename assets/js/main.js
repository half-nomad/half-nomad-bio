/*
====================================
🚀 하프노마드 메인 JavaScript
📱 모바일 우선 인터랙션 시스템
⚡ 성능 최적화된 애니메이션
====================================
*/

// 🎯 전역 설정
const ANIMATION_CONFIG = {
    duration: 600,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)',
    mobile: window.innerWidth < 768,
    reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches
};

// 🎨 애니메이션 유틸리티
class AnimationUtils {
    static fadeIn(element, delay = 0) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.transition = `all ${ANIMATION_CONFIG.duration}ms ${ANIMATION_CONFIG.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, delay);
    }
    
    static slideIn(element, direction = 'left', delay = 0) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        const translateValue = direction === 'left' ? '-30px' : '30px';
        element.style.opacity = '0';
        element.style.transform = `translateX(${translateValue})`;
        element.style.transition = `all ${ANIMATION_CONFIG.duration}ms ${ANIMATION_CONFIG.easing}`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, delay);
    }
    
    static bounce(element, intensity = 1) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        element.style.animation = `bounce-subtle ${1000 * intensity}ms infinite`;
    }
}

// 🔍 Intersection Observer 기반 스크롤 애니메이션
class ScrollAnimations {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        this.init();
    }
    
    init() {
        // Intersection Observer 생성
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.animateElement(entry.target);
                    // 한 번 애니메이션 된 요소는 더 이상 관찰하지 않음 (성능 최적화)
                    this.observer.unobserve(entry.target);
                }
            });
        }, this.observerOptions);
        
        // 애니메이션 대상 요소들 등록
        this.registerElements();
    }
    
    registerElements() {
        // fade-in 클래스를 가진 모든 요소
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => this.observer.observe(el));
        
        // 카드 요소들
        const cardElements = document.querySelectorAll('.card');
        cardElements.forEach(el => this.observer.observe(el));
        
        // 섹션 제목들
        const titleElements = document.querySelectorAll('.section-title');
        titleElements.forEach(el => this.observer.observe(el));
        
        // Final CTA Section 특별 요소들
        const finalCtaElements = document.querySelectorAll('.final-cta-section .social-proof-bar, .final-cta-section .final-headline, .final-cta-section .benefits-grid, .final-cta-section .main-cta-box, .final-cta-section .urgency-box, .final-cta-section .trust-indicators');
        finalCtaElements.forEach(el => {
            el.classList.add('fade-in');
            this.observer.observe(el);
        });
    }
    
    animateElement(element) {
        const animationType = element.dataset.animation || 'fade-in';
        const delay = parseInt(element.dataset.delay) || 0;
        
        switch (animationType) {
            case 'fade-in':
                AnimationUtils.fadeIn(element, delay);
                break;
            case 'slide-left':
                AnimationUtils.slideIn(element, 'left', delay);
                break;
            case 'slide-right':
                AnimationUtils.slideIn(element, 'right', delay);
                break;
            default:
                AnimationUtils.fadeIn(element, delay);
        }
        
        // 애니메이션 완료 표시
        element.classList.add('animated');
    }
}

// 🏆 Hero Section 특별 효과
class HeroEffects {
    constructor() {
        this.heroSection = document.getElementById('hero');
        this.scrollIndicator = document.querySelector('.scroll-indicator');
        this.profileImage = document.querySelector('.profile-image');
        this.init();
    }
    
    init() {
        this.setupScrollIndicator();
        this.setupProfileImageEffects();
        this.setupHeroAnimations();
    }
    
    setupScrollIndicator() {
        if (!this.scrollIndicator) return;
        
        // 스크롤 인디케이터 클릭 이벤트
        this.scrollIndicator.addEventListener('click', () => {
            const targetSection = document.getElementById('problem');
            if (targetSection) {
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
        
        // 스크롤에 따른 인디케이터 페이드아웃
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    const scrolled = window.scrollY;
                    const opacity = Math.max(0, 1 - (scrolled / 300));
                    this.scrollIndicator.style.opacity = opacity;
                    ticking = false;
                });
                ticking = true;
            }
        });
        
        // 바운스 애니메이션 시작
        AnimationUtils.bounce(this.scrollIndicator);
    }
    
    setupProfileImageEffects() {
        if (!this.profileImage) return;
        
        // 프로필 이미지 호버 효과
        this.profileImage.addEventListener('mouseenter', () => {
            if (!ANIMATION_CONFIG.reducedMotion) {
                this.profileImage.style.transform = 'scale(1.05) rotate(2deg)';
                this.profileImage.style.transition = 'transform 300ms ease';
            }
        });
        
        this.profileImage.addEventListener('mouseleave', () => {
            this.profileImage.style.transform = 'scale(1) rotate(0deg)';
        });
    }
    
    setupHeroAnimations() {
        // Hero 요소들 순차 애니메이션
        const heroTitle = this.heroSection.querySelector('.hero-title');
        const heroSubtitle = this.heroSection.querySelector('.hero-subtitle');
        const heroCta = this.heroSection.querySelector('.hero-cta');
        const heroStats = this.heroSection.querySelector('.stats-section');
        
        // 초기 로드 애니메이션
        setTimeout(() => {
            if (heroTitle) AnimationUtils.fadeIn(heroTitle, 0);
            if (heroSubtitle) AnimationUtils.fadeIn(heroSubtitle, 200);
            if (heroCta) AnimationUtils.fadeIn(heroCta, 400);
            if (heroStats) AnimationUtils.slideIn(heroStats, 'right', 600);
        }, 300);
    }
}

// 🎯 CTA 버튼 인터랙션
class CTAInteractions {
    constructor() {
        this.ctaButtons = document.querySelectorAll('.cta-button');
        this.init();
    }
    
    init() {
        this.ctaButtons.forEach(button => {
            this.setupButtonEffects(button);
        });
    }
    
    setupButtonEffects(button) {
        // 호버 시 리플 효과
        button.addEventListener('mouseenter', (e) => {
            if (ANIMATION_CONFIG.reducedMotion) return;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple-effect');
            button.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        // 클릭 시 피드백
        button.addEventListener('click', (e) => {
            if (!ANIMATION_CONFIG.reducedMotion) {
                button.style.transform = 'scale(0.95)';
                setTimeout(() => {
                    button.style.transform = 'scale(1)';
                }, 150);
            }
            
            // 스무스 스크롤 (내부 링크인 경우)
            const href = button.getAttribute('href');
            if (href && href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    }
}

// 📱 모바일 최적화
class MobileOptimizations {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupTouchFeedback();
        this.setupViewportFix();
        this.setupReducedMotionSupport();
    }
    
    setupTouchFeedback() {
        // 터치 디바이스에서 버튼 피드백
        document.addEventListener('touchstart', (e) => {
            if (e.target.classList.contains('cta-button') || 
                e.target.classList.contains('card')) {
                e.target.style.opacity = '0.8';
            }
        });
        
        document.addEventListener('touchend', (e) => {
            if (e.target.classList.contains('cta-button') || 
                e.target.classList.contains('card')) {
                e.target.style.opacity = '1';
            }
        });
    }
    
    setupViewportFix() {
        // iOS Safari 100vh 버그 수정
        const setVH = () => {
            const vh = window.innerHeight * 0.01;
            document.documentElement.style.setProperty('--vh', `${vh}px`);
        };
        
        setVH();
        window.addEventListener('resize', setVH);
        window.addEventListener('orientationchange', setVH);
    }
    
    setupReducedMotionSupport() {
        // 모션 감소 설정 감지
        const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        const handleMotionPreference = (e) => {
            ANIMATION_CONFIG.reducedMotion = e.matches;
            document.body.classList.toggle('reduce-motion', e.matches);
        };
        
        handleMotionPreference(mediaQuery);
        mediaQuery.addEventListener('change', handleMotionPreference);
    }
}

/*
====================================
🎯 What I Offer 탭 시스템
====================================
*/

class ServiceTabs {
    constructor() {
        this.tabButtons = document.querySelectorAll('.tab-button');
        this.tabContents = document.querySelectorAll('.tab-content');
        this.init();
    }
    
    init() {
        if (this.tabButtons.length === 0) return;
        
        // 탭 버튼 이벤트 등록
        this.tabButtons.forEach((button, index) => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const targetTab = button.dataset.tab;
                this.switchTab(targetTab, index);
            });
        });
        
        // 초기 상태 설정
        this.setInitialState();
    }
    
    switchTab(targetTab, buttonIndex) {
        // 모든 탭 버튼 비활성화
        this.tabButtons.forEach(btn => btn.classList.remove('active'));
        
        // 모든 탭 콘텐츠 숨김
        this.tabContents.forEach(content => {
            content.classList.remove('active');
            content.style.display = 'none';
        });
        
        // 선택된 탭 활성화
        this.tabButtons[buttonIndex].classList.add('active');
        
        // 선택된 콘텐츠 표시
        const targetContent = document.getElementById(targetTab);
        if (targetContent) {
            targetContent.classList.add('active');
            targetContent.style.display = 'block';
            
            // 애니메이션 효과
            this.animateTabContent(targetContent);
        }
        
        // 서비스 카드들 순차 애니메이션
        this.animateServiceCards(targetContent);
    }
    
    animateTabContent(content) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        content.style.opacity = '0';
        content.style.transform = 'translateY(20px)';
        
        requestAnimationFrame(() => {
            content.style.transition = `all ${ANIMATION_CONFIG.duration}ms ${ANIMATION_CONFIG.easing}`;
            content.style.opacity = '1';
            content.style.transform = 'translateY(0)';
        });
    }
    
    animateServiceCards(content) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        const serviceCards = content.querySelectorAll('.service-card');
        
        serviceCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.style.transition = `all ${ANIMATION_CONFIG.duration}ms ${ANIMATION_CONFIG.easing}`;
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150); // 150ms 간격으로 순차 애니메이션
        });
    }
    
    setInitialState() {
        // 첫 번째 탭을 기본 활성화
        if (this.tabButtons.length > 0) {
            this.tabButtons[0].classList.add('active');
        }
        
        if (this.tabContents.length > 0) {
            this.tabContents[0].classList.add('active');
            this.tabContents[0].style.display = 'block';
        }
    }
}

// 서비스 카드 호버 효과 개선
class ServiceCardEffects {
    constructor() {
        this.init();
    }
    
    init() {
        const serviceCards = document.querySelectorAll('.service-card');
        
        serviceCards.forEach(card => {
            // 마우스 엔터 효과
            card.addEventListener('mouseenter', (e) => {
                this.handleCardHover(e.target, true);
            });
            
            // 마우스 리브 효과
            card.addEventListener('mouseleave', (e) => {
                this.handleCardHover(e.target, false);
            });
            
            // 포커스 효과 (접근성)
            card.addEventListener('focus', (e) => {
                this.handleCardHover(e.target, true);
            });
            
            card.addEventListener('blur', (e) => {
                this.handleCardHover(e.target, false);
            });
        });
    }
    
    handleCardHover(card, isHovering) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        const icon = card.querySelector('.icon-wrapper');
        const title = card.querySelector('.service-content h3');
        
        if (isHovering) {
            // 호버 시 미세한 회전 효과
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s ease';
            }
            
            // 제목 그라데이션 효과
            if (title) {
                title.style.background = 'linear-gradient(135deg, var(--accent) 0%, var(--secondary) 100%)';
                title.style.webkitBackgroundClip = 'text';
                title.style.webkitTextFillColor = 'transparent';
                title.style.backgroundClip = 'text';
            }
        } else {
            // 호버 해제
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            if (title) {
                title.style.background = 'none';
                title.style.webkitTextFillColor = 'var(--text-primary)';
                title.style.color = 'var(--text-primary)';
            }
        }
    }
}

// 🚀 메인 앱 초기화
class HalfNomadApp {
    constructor() {
        this.isLoaded = false;
        this.init();
    }
    
    init() {
        // DOM 로드 완료 후 초기화
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.startApp());
        } else {
            this.startApp();
        }
    }
    
    startApp() {
        try {
            // 성능 측정 시작
            const startTime = performance.now();
            
            // 모든 모듈 초기화
            this.initNavigation(); // 네비게이션 초기화 추가
            this.scrollAnimations = new ScrollAnimations();
            this.heroEffects = new HeroEffects();
            this.ctaInteractions = new CTAInteractions();
            this.mobileOptimizations = new MobileOptimizations();
            
            // What I Offer 섹션 초기화
            this.serviceTabs = new ServiceTabs();
            this.serviceCardEffects = new ServiceCardEffects();
            
            // Current Projects 섹션 초기화
            this.currentProjectsEffects = new CurrentProjectsEffects();
            
            // 새로운 최적화 기능들 초기화
            this.backToTopButton = new BackToTopButton();
            this.scrollProgressIndicator = new ScrollProgressIndicator();
            this.lazyLoadOptimizer = new LazyLoadOptimizer();
            this.accessibilityEnhancer = new AccessibilityEnhancer();
            
            // 로딩 완료 표시
            this.isLoaded = true;
            document.body.classList.add('app-loaded');
            
            // 성능 로그 (개발 환경에서만)
            const loadTime = performance.now() - startTime;
            if (window.location.hostname === 'localhost') {
                console.log(`🚀 HalfNomad App initialized in ${loadTime.toFixed(2)}ms`);
                console.log('📊 Initialized modules:', {
                    scrollAnimations: !!this.scrollAnimations,
                    heroEffects: !!this.heroEffects,
                    ctaInteractions: !!this.ctaInteractions,
                    serviceTabs: !!this.serviceTabs,
                    currentProjects: !!this.currentProjectsEffects,
                    backToTop: !!this.backToTopButton,
                    scrollProgress: !!this.scrollProgressIndicator,
                    lazyLoad: !!this.lazyLoadOptimizer,
                    accessibility: !!this.accessibilityEnhancer
                });
            }
            
            // 커스텀 이벤트 발행
            const appLoadedEvent = new CustomEvent('halfnomad:loaded', {
                detail: { loadTime, timestamp: Date.now() }
            });
            document.dispatchEvent(appLoadedEvent);
            
        } catch (error) {
            console.error('HalfNomad App initialization failed:', error);
        }
    }
    
    // 🧭 네비게이션 기능
    initNavigation() {
        const navbar = document.getElementById('navbar');
        const mobileToggle = document.getElementById('mobile-menu-toggle');
        const navMenu = document.getElementById('nav-menu');
        const navLinks = document.querySelectorAll('.nav-link');

        // 스크롤 시 네비게이션 스타일 변경
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 100) {
                navbar?.classList.add('scrolled');
            } else {
                navbar?.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        });

        // 모바일 메뉴 토글
        if (mobileToggle && navMenu) {
            mobileToggle.addEventListener('click', () => {
                mobileToggle.classList.toggle('active');
                navMenu.classList.toggle('active');
                
                // 바디 스크롤 방지/허용
                if (navMenu.classList.contains('active')) {
                    document.body.style.overflow = 'hidden';
                } else {
                    document.body.style.overflow = '';
                }
            });
        }

        // 네비게이션 링크 클릭 시 부드러운 스크롤
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetId = href.substring(1);
                    const targetElement = document.getElementById(targetId);
                    
                    if (targetElement) {
                        const offsetTop = targetElement.offsetTop - 80; // 네비게이션 높이 고려
                        
                        window.scrollTo({
                            top: offsetTop,
                            behavior: 'smooth'
                        });
                        
                        // 모바일 메뉴 닫기
                        if (navMenu.classList.contains('active')) {
                            mobileToggle.classList.remove('active');
                            navMenu.classList.remove('active');
                            document.body.style.overflow = '';
                        }
                        
                        // 활성 링크 업데이트
                        navLinks.forEach(navLink => navLink.classList.remove('active'));
                        link.classList.add('active');
                    }
                }
            });
        });

        // 스크롤 위치에 따른 활성 섹션 표시
        const sections = document.querySelectorAll('section[id]');
        
        const observerOptions = {
            root: null,
            rootMargin: '-80px 0px -50% 0px',
            threshold: 0
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const sectionId = entry.target.id;
                    navLinks.forEach(navLink => {
                        navLink.classList.remove('active');
                        if (navLink.getAttribute('href') === `#${sectionId}`) {
                            navLink.classList.add('active');
                        }
                    });
                }
            });
        }, observerOptions);

        sections.forEach(section => observer.observe(section));
    }
    
    // 외부에서 접근 가능한 API
    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
    
    // 애니메이션 상태 토글
    toggleAnimations() {
        ANIMATION_CONFIG.reducedMotion = !ANIMATION_CONFIG.reducedMotion;
        document.body.classList.toggle('reduce-motion', ANIMATION_CONFIG.reducedMotion);
    }
}

// 📊 성능 모니터링 (선택적)
class PerformanceMonitor {
    static logWebVitals() {
        // Core Web Vitals 측정
        new PerformanceObserver((entryList) => {
            for (const entry of entryList.getEntries()) {
                if (window.location.hostname === 'localhost') {
                    console.log(`📊 ${entry.name}: ${entry.value.toFixed(2)}ms`);
                }
            }
        }).observe({ entryTypes: ['measure', 'navigation'] });
    }
}

// 🎯 앱 시작
const app = new HalfNomadApp();

// 개발 환경에서 성능 모니터링
if (window.location.hostname === 'localhost') {
    PerformanceMonitor.logWebVitals();
}

// 전역 접근을 위한 window 객체에 추가
window.HalfNomadApp = app;

// 🎨 CSS 애니메이션 추가
const additionalStyles = `
    /* 바운스 애니메이션 */
    @keyframes bounce-subtle {
        0%, 20%, 50%, 80%, 100% {
            transform: translateY(0);
        }
        40% {
            transform: translateY(-5px);
        }
        60% {
            transform: translateY(-2px);
        }
    }
    
    /* 리플 효과 */
    .ripple-effect {
        position: absolute;
        top: 50%;
        left: 50%;
        width: 0;
        height: 0;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.3);
        transform: translate(-50%, -50%);
        animation: ripple 0.6s linear;
        pointer-events: none;
    }
    
    @keyframes ripple {
        to {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
    
    /* 모션 감소 설정 */
    .reduce-motion * {
        animation-duration: 0.01ms !important;
        transition-duration: 0.01ms !important;
    }
    
    /* 앱 로드 완료 후 최적화 */
    .app-loaded {
        --loading-complete: 1;
    }
    
    /* iOS Safari 100vh 버그 수정 */
    .section-hero {
        min-height: 100vh;
        min-height: calc(var(--vh, 1vh) * 100);
    }
`;

// 스타일 동적 추가
const styleSheet = document.createElement('style');
styleSheet.textContent = additionalStyles;
document.head.appendChild(styleSheet);


/*
====================================
7. Current Projects 인터랙션
====================================
*/

class CurrentProjectsEffects {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupProjectCards();
        this.setupTechTags();
        this.setupStatusAnimation();
    }
    
    setupProjectCards() {
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => this.handleCardHover(card, true));
            card.addEventListener('mouseleave', () => this.handleCardHover(card, false));
            
            // 접근성을 위한 키보드 이벤트
            card.addEventListener('focus', () => this.handleCardHover(card, true));
            card.addEventListener('blur', () => this.handleCardHover(card, false));
        });
    }
    
    handleCardHover(card, isHovering) {
        if (ANIMATION_CONFIG.reducedMotion) return;
        
        const icon = card.querySelector('.project-icon');
        const statusBadge = card.querySelector('.status-badge');
        
        if (isHovering) {
            // 아이콘 회전 및 확대
            if (icon) {
                icon.style.transform = 'scale(1.1) rotate(5deg)';
                icon.style.transition = 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
            }
            
            // 상태 배지 펄스 효과
            if (statusBadge) {
                statusBadge.style.animation = 'pulse 1.5s infinite';
            }
        } else {
            // 원래 상태로 복원
            if (icon) {
                icon.style.transform = 'scale(1) rotate(0deg)';
            }
            
            if (statusBadge) {
                statusBadge.style.animation = 'none';
            }
        }
    }
    
    setupTechTags() {
        const techTags = document.querySelectorAll('.project-tech .tech-tag');
        
        techTags.forEach((tag, index) => {
            // 순차 페이드 인 애니메이션
            tag.style.opacity = '0';
            tag.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                tag.style.opacity = '1';
                tag.style.transform = 'translateY(0)';
                tag.style.transition = 'all 0.4s ease';
            }, index * 100);
            
            // 호버 이벤트
            tag.addEventListener('mouseenter', () => {
                if (!ANIMATION_CONFIG.reducedMotion) {
                    tag.style.transform = 'translateY(-2px) scale(1.05)';
                }
            });
            
            tag.addEventListener('mouseleave', () => {
                tag.style.transform = 'translateY(0) scale(1)';
            });
        });
    }
    
    setupStatusAnimation() {
        // 상태 배지에서 펄스 애니메이션을 위한 CSS 추가
        if (!document.querySelector('#status-animation-styles')) {
            const style = document.createElement('style');
            style.id = 'status-animation-styles';
            style.textContent = `
                @keyframes pulse {
                    0% { box-shadow: 0 0 0 0 rgba(101, 175, 255, 0.7); }
                    70% { box-shadow: 0 0 0 8px rgba(101, 175, 255, 0); }
                    100% { box-shadow: 0 0 0 0 rgba(101, 175, 255, 0); }
                }
                
                .project-metrics .metric-number {
                    animation: countUp 2s ease-out forwards;
                }
                
                @keyframes countUp {
                    from { transform: scale(0.5); opacity: 0; }
                    to { transform: scale(1); opacity: 1; }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

/*
====================================
🚀 Back to Top & 최종 최적화
====================================
*/

// Back to Top 버튼 기능
class BackToTopButton {
    constructor() {
        this.button = null;
        this.threshold = 300; // 300px 스크롤 후 버튼 표시
        this.init();
    }
    
    init() {
        this.createButton();
        this.setupScrollListener();
    }
    
    createButton() {
        // Back to Top 버튼 생성
        this.button = document.createElement('button');
        this.button.className = 'back-to-top';
        this.button.innerHTML = '↑';
        this.button.setAttribute('aria-label', '맨 위로 이동');
        this.button.setAttribute('title', '맨 위로 이동');
        
        // 초기 상태는 숨김
        this.button.style.cssText = `
            position: fixed;
            bottom: 2rem;
            right: 2rem;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            border: none;
            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);
            color: white;
            font-size: 1.2rem;
            font-weight: bold;
            cursor: pointer;
            z-index: 1000;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            opacity: 0;
            visibility: hidden;
            transform: translateY(20px);
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
        `;
        
        // 클릭 이벤트
        this.button.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // 호버 효과
        this.button.addEventListener('mouseenter', () => {
            if (!ANIMATION_CONFIG.reducedMotion) {
                this.button.style.transform = 'translateY(0) scale(1.1)';
            }
        });
        
        this.button.addEventListener('mouseleave', () => {
            this.button.style.transform = 'translateY(0) scale(1)';
        });
        
        document.body.appendChild(this.button);
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateButtonVisibility();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateButtonVisibility() {
        const scrolled = window.scrollY;
        const isVisible = scrolled > this.threshold;
        
        if (isVisible && this.button.style.opacity === '0') {
            // 버튼 표시
            this.button.style.opacity = '1';
            this.button.style.visibility = 'visible';
            this.button.style.transform = 'translateY(0)';
        } else if (!isVisible && this.button.style.opacity === '1') {
            // 버튼 숨김
            this.button.style.opacity = '0';
            this.button.style.visibility = 'hidden';
            this.button.style.transform = 'translateY(20px)';
        }
    }
}

// 스크롤 진행률 표시기
class ScrollProgressIndicator {
    constructor() {
        this.indicator = null;
        this.init();
    }
    
    init() {
        this.createIndicator();
        this.setupScrollListener();
    }
    
    createIndicator() {
        this.indicator = document.createElement('div');
        this.indicator.className = 'scroll-progress';
        this.indicator.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 0%;
            height: 3px;
            background: linear-gradient(90deg, var(--primary) 0%, var(--secondary) 50%, var(--accent) 100%);
            z-index: 9999;
            transition: width 0.1s ease-out;
            border-radius: 0 3px 3px 0;
        `;
        
        document.body.appendChild(this.indicator);
    }
    
    setupScrollListener() {
        let ticking = false;
        
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    this.updateProgress();
                    ticking = false;
                });
                ticking = true;
            }
        });
    }
    
    updateProgress() {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        
        this.indicator.style.width = `${scrolled}%`;
    }
}

// 성능 최적화를 위한 이미지 레이지 로딩 강화
class LazyLoadOptimizer {
    constructor() {
        this.images = [];
        this.observer = null;
        this.init();
    }
    
    init() {
        // IntersectionObserver가 지원되는 경우에만 실행
        if ('IntersectionObserver' in window) {
            this.setupObserver();
            this.findImages();
        } else {
            // 폴백: 모든 이미지 즉시 로드
            this.loadAllImages();
        }
    }
    
    setupObserver() {
        const config = {
            rootMargin: '50px 0px',
            threshold: 0.01
        };
        
        this.observer = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    this.loadImage(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, config);
    }
    
    findImages() {
        // data-src 속성을 가진 모든 이미지 찾기
        const lazyImages = document.querySelectorAll('img[data-src]');
        
        lazyImages.forEach(img => {
            this.observer.observe(img);
        });
    }
    
    loadImage(img) {
        const src = img.getAttribute('data-src');
        if (!src) return;
        
        // 새 이미지 객체 생성하여 프리로드
        const imageLoader = new Image();
        
        imageLoader.onload = () => {
            // 로드 완료 후 실제 이미지에 적용
            img.src = src;
            img.classList.add('loaded');
            img.removeAttribute('data-src');
        };
        
        imageLoader.onerror = () => {
            img.classList.add('error');
        };
        
        imageLoader.src = src;
    }
    
    loadAllImages() {
        const lazyImages = document.querySelectorAll('img[data-src]');
        lazyImages.forEach(img => {
            img.src = img.getAttribute('data-src');
            img.removeAttribute('data-src');
        });
    }
}

// 키보드 접근성 향상
class AccessibilityEnhancer {
    constructor() {
        this.init();
    }
    
    init() {
        this.setupKeyboardNavigation();
        this.setupFocusIndicators();
        this.setupSkipLinks();
    }
    
    setupKeyboardNavigation() {
        // Tab 키 포커스 시각적 표시 강화
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                document.body.classList.add('using-keyboard');
            }
        });
        
        document.addEventListener('mousedown', () => {
            document.body.classList.remove('using-keyboard');
        });
    }
    
    setupFocusIndicators() {
        const style = document.createElement('style');
        style.textContent = `
            .using-keyboard *:focus {
                outline: 2px solid var(--accent) !important;
                outline-offset: 2px !important;
            }
            
            .using-keyboard .cta-button:focus {
                outline: 3px solid rgba(101, 175, 255, 0.8) !important;
                box-shadow: 0 0 0 5px rgba(101, 175, 255, 0.2) !important;
            }
        `;
        document.head.appendChild(style);
    }
    
    setupSkipLinks() {
        // 스킵 링크 생성 (스크린 리더 사용자를 위해)
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = '메인 콘텐츠로 바로가기';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;
        
        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });
        
        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });
        
        document.body.insertBefore(skipLink, document.body.firstChild);
    }
}

/*
====================================
끝: 하프노마드 JavaScript 시스템
====================================
*/