// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {

  // =====================================================================
  // [0] Hero Section Load Animation
  // =====================================================================
  const heroTl = gsap.timeline();

  heroTl
    .from(".sub-subtitle", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.2 })
    .from(".sub-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
    .from(".sub-hero-tabs .tab-item", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", stagger: 0.1 }, "-=0.4");

  // =====================================================================
  // [0.5] Parallax Hero Content (텍스트가 스크롤 따라 올라감)
  // =====================================================================
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

  // =====================================================================
  // [1] Custom Mouse Cursor
  // =====================================================================
  const cursor = document.querySelector('.custom-cursor');

  if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

    let isFirstMove = true; 

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

    document.body.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 }));
    document.body.addEventListener("mouseenter", () => {
      if (!isFirstMove) gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
    });

    window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
    window.addEventListener("mouseup", () => gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }));

    const hoverElements = document.querySelectorAll('.header-logo a, .gnb a, .header-btn, .tab-item, .sec7-btn, a, button');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });
  }




  // =====================================================================
  // [1.5] Sticky Tab Bar Animation (채용 페이지용 최적화)
  // =====================================================================
  const stickyTabBar = document.querySelector('.sticky-tab-bar');
  const contentArea = document.querySelector('.recruit-content-area'); // 다음 섹션

  if (stickyTabBar && contentArea) {
    ScrollTrigger.create({
      trigger: contentArea,
      start: "top 20%", // 채용 콘텐츠 영역이 상단 20% 지점까지 올라왔을 때
      onEnter: () => stickyTabBar.classList.add('is-visible'), // 등장
      onLeaveBack: () => stickyTabBar.classList.remove('is-visible') // 퇴장
    });
  }



  // =====================================================================
  // [2] Section 07 (문의하기) Fade In Animation
  // =====================================================================
  const sec7Container = document.querySelector(".sec7-container");
  
  if (sec7Container) {
    gsap.to(sec7Container, {
      scrollTrigger: {
        trigger: ".section-07",
        start: "top 70%", 
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });
  }

});

// =====================================================================
// [3] Utilities: 푸터 TOP 버튼 이동 기능
// =====================================================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}


