// GSAP 플러그인 등록 (최상단에 한 번만 선언)
gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// [1] Custom Mouse Cursor (마우스 커서 효과 통합)
// =====================================================================
const cursor = document.querySelector('.custom-cursor');

if (cursor) {
  // 커서 중심축 및 성능 최적화
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  // 커서 이동
  window.addEventListener("mousemove", (e) => {
    xTo(e.clientX);
    yTo(e.clientY);
  });

  // 화면 밖으로 나갈 때 숨김 / 들어올 때 표시
  document.body.addEventListener("mouseleave", () => gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 }));
  document.body.addEventListener("mouseenter", () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 }));

  // 클릭 시 스케일 축소/복구
  window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
  window.addEventListener("mouseup", () => gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }));

  // 호버 요소 확대 효과 (서브페이지에 존재하는 요소들로 깔끔하게 정리)
  const hoverElements = document.querySelectorAll(
    '.header-logo a, .gnb a, .header-btn, .tab-item, .sec7-btn, a, button'
  );
  
  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}

// =====================================================================
// [2] Smart Header (스크롤 반응형 상단 메뉴바)
// =====================================================================
let lastScrollY = window.scrollY;

window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  // 스크롤 내릴 때 (80px 이상) 숨김, 올릴 때 나타남
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    gsap.to('.header', { y: -80, duration: 0.3, ease: "power2.out" }); 
  } else {
    gsap.to('.header', { y: 0, duration: 0.3, ease: "power2.out" }); 
  }
  lastScrollY = currentScrollY;
});


// =====================================================================
// [3] Scroll Animations (서브페이지 스크롤 애니메이션)
// =====================================================================

// 1. 서브페이지 Section 02: 서비스 리스트 순차적 등장 애니메이션
const serviceItems = gsap.utils.toArray('.service-item');
if (serviceItems.length > 0) {
  serviceItems.forEach((item, i) => {
    gsap.from(item, {
      scrollTrigger: {
        trigger: item,
        start: "top 85%", // 항목이 화면 아래에서 85% 지점에 올 때 실행
      },
      opacity: 0,
      y: 30, // 30px 아래에서 위로 올라옴
      duration: 0.8,
      ease: "power3.out",
      delay: i * 0.1 // 각 항목마다 0.1초씩 시차를 두고 등장
    });
  });
}

// 2. 공통 Section 07 (문의하기): 페이드인 애니메이션
const sec7 = document.querySelector(".section-07");
if (sec7) {
  gsap.to(".sec7-container", {
    scrollTrigger: {
      trigger: ".section-07",
      start: "top 70%", // 섹션이 화면 아래에서 70% 정도 올라왔을 때 실행
    },
    opacity: 1,
    y: 0,
    duration: 1,
    ease: "power3.out"
  });
}


// =====================================================================
// [4] Utilities (기타 기능)
// =====================================================================
// 푸터 TOP 버튼 이동 기능
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}