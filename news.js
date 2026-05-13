gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {

    // =====================================================================
    // [1] 커스텀 마우스 커서 로직 (완벽 복구)
    // =====================================================================
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
        let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

        let isFirstMove = true; 

        // 마우스 이동 감지 및 추적
        window.addEventListener("mousemove", (e) => {
            if (isFirstMove) {
                gsap.set(cursor, { x: e.clientX, y: e.clientY });
                gsap.to(cursor, { opacity: 1, duration: 0.3 });
                isFirstMove = false;
            } else {
                xTo(e.clientX);
                yTo(e.clientY);
            }
        });

        // 화면 밖으로 나갈 때 숨김
        document.body.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 }));
        document.body.addEventListener("mouseenter", () => {
            if (!isFirstMove) gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
        });

        // 클릭 효과
        window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
        window.addEventListener("mouseup", () => gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }));

        // 호버 효과 (버튼, 링크 등)
        const hoverElements = document.querySelectorAll('a, button, .header-btn, .top-btn, .side-item');
        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
        });
    }

    // =====================================================================
    // [2] Parallax News Hero Content (텍스트 탈출 로직)
    // =====================================================================
    const heroContainer = document.querySelector(".sub-hero-container");
    if (heroContainer) {
        gsap.to(heroContainer, {
            y: -1500, // 텍스트를 위로 강하게 밀어냄
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "+=1500",
                scrub: true
            }
        });
    }

    // =====================================================================
    // [3] Hero Section Load Animation
    // =====================================================================
    const heroTl = gsap.timeline();
    heroTl
        .from(".sub-subtitle", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.2 })
        .from(".sub-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".news-hero-desc", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.6");

});

// 푸터 TOP 버튼
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}