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
  // [1.8] Section 1 : 시네마틱 텍스트 스크롤 애니메이션
  // =====================================================================
  const recruitSec1 = document.querySelector(".recruit-section-01");

  if (recruitSec1) {
    // 3개의 글자 줄을 배열로 묶어서 차례대로 제어합니다.
    const lines = [".recruit-line-1", ".recruit-line-2", ".recruit-line-3"];

    // 🔥 메인 페이지와 동일한 스크롤 연동(Scrub) 방식
    gsap.fromTo(lines, 
      { 
        opacity: 0, 
        filter: "blur(20px)", 
        y: 30 // 살짝 아래에서 위로 올라오는 느낌 추가
      }, 
      {
        opacity: 1, 
        filter: "blur(0px)",
        y: 0,
        scrollTrigger: {
          trigger: ".recruit-section-01",
          start: "top 75%", // 섹션이 화면에 조금 보이기 시작할 때 등장
          end: "center center", // 섹션이 한가운데 오면 뚜렷해짐
          scrub: 1.5 // 스크롤 올리면 다시 부드럽게 되감기
        },
        stagger: 0.3, // 🔥 핵심: 0.3초 간격으로 1번 줄, 2번 줄, 3번 줄이 차례대로 등장!
        ease: "power2.out"
      }
    );
  }




  // =====================================================================
  // [1.9] Section 2 : 핵심가치 내부 텍스트 등장 & 모든 카드 스태킹 변형
  // =====================================================================
  const valuePanels = gsap.utils.toArray(".value-panel");

  if (valuePanels.length > 0) {
    valuePanels.forEach((panel, i) => {
      const title = panel.querySelector(".value-title");
      const desc = panel.querySelector(".value-desc");
      const pillWrapper = panel.querySelector(".value-pill-wrapper");
      const keyword = panel.querySelector(".value-keyword");
      const gradientOverlay = panel.querySelector(".value-gradient-overlay");

      // --- [1단계] 패널이 처음 화면에 들어올 때 텍스트 등장 ---
      const panelTl = gsap.timeline({
        scrollTrigger: {
          trigger: panel,
          start: "top 70%", 
          toggleActions: "play none none reverse" 
        }
      });

      panelTl
        .from(title, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" })
        .from(desc, { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6")
        .from(keyword, { opacity: 0, scale: 0.9, duration: 1, ease: "power3.out" }, "-=0.6");

      // --- [2단계] 현재 패널이 천장에 닿았을 때 이미지 영역 변형 (모든 패널 적용!) ---
      gsap.timeline({
        scrollTrigger: {
          trigger: panel,       
          start: "top top",     
          end: "+=40%",        
          scrub: true,          
        }
      })
      .fromTo(pillWrapper, 
        {
          borderRadius: "0px",
          width: "100%", 
          height: "100%"
        },
        {
          borderRadius: "500px", 
          width: "100%",          
          height: "100%",
          ease: "none",
        }, 0) 
        
      .fromTo(gradientOverlay, 
        { opacity: 0 },
        { 
          opacity: 0.5, 
          ease: "none" 
        }, 0); 
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


