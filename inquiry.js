gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {

    // [1] 커스텀 마우스 커서
    const cursor = document.querySelector('.custom-cursor');
    if (cursor) {
        gsap.set(cursor, { xPercent: -50, yPercent: -50 });
        let xTo = gsap.quickTo(cursor, "x", { duration: 0.15 });
        let yTo = gsap.quickTo(cursor, "y", { duration: 0.15 });

        window.addEventListener("mousemove", (e) => {
            gsap.to(cursor, { opacity: 1, duration: 0.3 });
            xTo(e.clientX);
            yTo(e.clientY);
        });

        const hoverElements = document.querySelectorAll('a, button, .header-btn, .top-btn');
        hoverElements.forEach((el) => {
            el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
        });
    }

    // [2] Parallax (텍스트 탈출)
    const heroContainer = document.querySelector(".sub-hero-container");
    if (heroContainer) {
        gsap.to(heroContainer, {
            y: -1500,
            ease: "none",
            scrollTrigger: {
                trigger: "body",
                start: "top top",
                end: "+=1500",
                scrub: true
            }
        });
    }

    // [3] Hero Load Animation
    const heroTl = gsap.timeline();
    heroTl
        .from(".sub-subtitle", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.2 })
        .from(".sub-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(".inquiry-hero-desc", { opacity: 0, y: 20, duration: 0.8, ease: "power3.out" }, "-=0.6");
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}