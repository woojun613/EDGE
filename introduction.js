// GSAP 플러그인 등록
gsap.registerPlugin(ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {

  // =====================================================================
  // [0] Hero Section Load Animation
  // =====================================================================
  const heroTl = gsap.timeline();

  heroTl
    .from(".sub-subtitle", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out", delay: 0.2 })
    .from(".sub-title", { opacity: 0, y: 30, duration: 0.8, ease: "power3.out" }, "-=0.6");
    // .from(".sub-hero-tabs .tab-item", { opacity: 0, y: 20, duration: 0.6, ease: "power3.out", stagger: 0.1 }, "-=0.4");




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
  // [3] Custom Mouse Cursor (호버, 클릭 액션 완벽 복구!)
  // =====================================================================
  const cursor = document.querySelector('.custom-cursor');
  if (cursor) {
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });
    let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
    let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

    let isFirstMove = true; 

    // 마우스 이동
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

    // 마우스 클릭 시 쫀득한 효과
    window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
    window.addEventListener("mouseup", () => gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }));

    // 링크, 버튼 등에 올렸을 때 커서 커지는 효과 복구
    const hoverElements = document.querySelectorAll('.header-logo a, .gnb a, .header-btn, .sec7-btn, a, button, .side-item');
    hoverElements.forEach((el) => {
      el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
      el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
    });

    // 지도 영역(.location-map-box)에 들어가면 커서 숨기기
    const mapBox = document.querySelector('.location-map-box');
    if (mapBox) {
      mapBox.addEventListener('mouseenter', () => {
        gsap.to(cursor, { opacity: 0, scale: 0, duration: 0.2 });
      });
      mapBox.addEventListener('mouseleave', () => {
        gsap.to(cursor, { opacity: 1, scale: 1, duration: 0.2 });
      });
    }
  }







  // =====================================================================
  // [3.5] Mission Section Animation (소개페이지 미션 영역 페이드인 조립 효과)
  // =====================================================================
  const missionSec = document.querySelector(".intro-mission-section");
  
  if (missionSec) {
    // 1. 상단 텍스트 등장
    gsap.from(".mission-header", {
      scrollTrigger: {
        trigger: missionSec,
        start: "top 75%",
      },
      y: 40,
      opacity: 0,
      duration: 0.8,
      ease: "power3.out"
    });

    // 2. 하단 그래픽 스크롤 조립 애니메이션 (Timeline 활용)
    const graphicTl = gsap.timeline({
      scrollTrigger: {
        trigger: ".mission-graphic-box",
        start: "top 70%",
      }
    });

    // 배경 상자 먼저 등장
    graphicTl.from(".mission-graphic-box", { y: 50, opacity: 0, duration: 0.8, ease: "power3.out" })
             // 알약 배경이 스르륵 커짐
             .from(".graphic-inner-pill", { scale: 0.8, opacity: 0, duration: 0.8, ease: "back.out(1.2)" }, "-=0.4")
             // 왼쪽 원은 왼쪽에서, 오른쪽 원은 오른쪽에서 날아와 중앙으로 합쳐지는 느낌!
             .from(".circle-item", { 
               x: (i) => i === 0 ? -100 : 100, // 첫 번째 원은 -100px, 두 번째 원은 +100px에서 출발
               opacity: 0, 
               duration: 1, 
               ease: "power3.out",
               stagger: 0.1 
             }, "-=0.6")
             // 선이 찌~익 그어짐
             .from(".line", { width: 0, opacity: 0, duration: 0.6, stagger: 0.2 }, "-=0.6")
             // 마지막으로 중앙 텍스트가 뿅!
             .from(".center-text", { scale: 0.8, opacity: 0, y: 10, duration: 0.6, ease: "power3.out" }, "-=0.4");
  }






// =====================================================================
  // [3.6] Vision Section Animation (비전 영역 페이드인 조립 효과)
  // =====================================================================
  const visionSec = document.querySelector(".intro-vision-section");
  
  if (visionSec) {
    const visionTl = gsap.timeline({
      scrollTrigger: {
        trigger: visionSec,
        start: "top 75%",
      }
    });

    visionTl.from(".intro-vision-section .en-title", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" })
            .from(".intro-vision-section .ko-title", { x: -30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
            .from(".vision-slogan", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
            .from(".vision-desc", { y: 30, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.6")
            // 마지막 파란색 빈 박스가 나타나는 효과
            .from(".vision-placeholder", { y: 40, opacity: 0, duration: 0.8, ease: "power3.out" }, "-=0.4");
  }




  // =====================================================================
  // [3.7] Core Value Section Animation (선 긋기와 아이콘의 완벽한 동기화)
  // =====================================================================
  const valueSec = document.querySelector(".intro-value-section");
  
  if (valueSec) {
    const valueTl = gsap.timeline({
      scrollTrigger: {
        trigger: valueSec,
        start: "top 70%", // 약간 일찍 시작해서 스크롤 내릴 때 효과가 잘 보이도록 조정
      }
    });

    // 1. 헤더 (CORE VALUE / 핵심가치) 먼저 등장
    valueTl.from(".value-header > *", { 
      y: 30, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out" 
    })
    
    // 2. 🔥 선이 왼쪽에서 오른쪽으로 '쭉-' 그려짐 (scaleX 사용으로 훨씬 부드러움)
    // 3. 🔥 동시에 아이콘들이 선이 지나가는 위치에 맞춰 순차적으로 팝업!
    .fromTo(".value-connecting-line", 
      { scaleX: 0, transformOrigin: "left center", opacity: 0 }, 
      { scaleX: 1, opacity: 1, duration: 1.8, ease: "power2.inOut" }, 
      "-=0.4" // 헤더가 거의 다 나올 때쯤 선 긋기 시작
    )
    .from(".value-item", {
      y: 40,
      opacity: 0,
      duration: 0.8,
      stagger: 0.3, // 선이 길게 그려지는 속도에 맞춰 아이콘이 하나씩 나타남
      ease: "back.out(1.7)", // 살짝 튕기며 나타나게 해서 '생동감' 추가
    }, "-=1.5"); // 선이 절반쯤 그려졌을 때부터 첫 번째 아이콘이 나오기 시작함
  }




  // =====================================================================
  // [3.8] Location Section Animation (소개페이지 위치 정보 등장)
  // =====================================================================
  const locationSec = document.querySelector(".intro-location-section");
  
  if (locationSec) {
    const locTl = gsap.timeline({
      scrollTrigger: {
        trigger: locationSec,
        start: "top 75%",
      }
    });

    locTl.from(".intro-location-section .en-title", { opacity: 0, y: 30, duration: 0.8 })
         .from(".info-item", { 
            opacity: 0, 
            x: -40, 
            duration: 0.8, 
            stagger: 0.2, 
            ease: "power3.out" 
         }, "-=0.4")
         .from(".location-map-box", { 
            opacity: 0, 
            x: 50, 
            duration: 1, 
            ease: "power3.out" 
         }, "-=0.8");
  }





  // =====================================================================
  // [4] Section 07 (문의하기) Fade In Animation
  // =====================================================================
  const sec7Container = document.querySelector(".sec7-container");
  if (sec7Container) {
    gsap.to(sec7Container, {
      scrollTrigger: {
        trigger: ".section-07",
        start: "top 75%",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out"
    });
  }

});





// =====================================================================
// [5] Utilities: 푸터 TOP 버튼 이동 기능
// =====================================================================
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}