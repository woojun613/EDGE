// GSAP 플러그인 등록 (최상단에 한 번만 선언)
gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// [1] Custom Mouse Cursor (마우스 커서 효과 통합)
// =====================================================================
const cursor = document.querySelector('.custom-cursor');

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

// 호버 요소 확대 효과
const hoverElements = document.querySelectorAll(
  '.sec1-btn, .card-slide, .swiper-pagination-bullet, .card-wrapper, .sec5-btn, .sec7-btn, .header-logo a, .gnb a, .header-btn, a, button'
);
hoverElements.forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
});

// iframe(지도) 위에서 커스텀 커서 숨기기 (블랙홀 현상 방지)
const mapArea = document.querySelector('.sec6-map');
if (mapArea) {
  mapArea.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 }));
  mapArea.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 }));
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
// [3] Main Intro Animation (섹션 1 페이지 로드 애니메이션)
// =====================================================================
// 1. 깜빡임 방지 세팅
gsap.set(".header", { y: -80, opacity: 0 });
gsap.set(".sec1-title, .sec1-desc", { y: 50, opacity: 0 });
gsap.set(".sec1-btn", { scale: 0.8, opacity: 0 });

// 2. 타임라인 실행
window.addEventListener("load", () => {
  const introTl = gsap.timeline();
  introTl
    .to(".header", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .to(".sec1-title", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
    .to(".sec1-desc", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.7")
    .to(".sec1-btn", { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");
});


// =====================================================================
// [4] GSAP Scroll Animations (섹션별 스크롤 트리거)
// =====================================================================
// Section 3 : 패널 전환 (핀 고정 애니메이션)
const panels = gsap.utils.toArray(".gradient-box.panel");
gsap.set(panels.slice(1), { autoAlpha: 0, scale: 0.8 }); // 첫 번째 제외 숨김

const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-03",
    start: "center center",
    end: "+=2000",
    scrub: 1,
    pin: true,
    anticipatePin: 1,
  }
});
panels.forEach((panel, i) => {
  if (i !== 0) {
    tl.to(panels[i - 1], { autoAlpha: 0, scale: 0.8, duration: 1 }, `step${i}`)
      .to(panel, { autoAlpha: 1, scale: 1, duration: 1 }, `step${i}`);
  }
  tl.to({}, { duration: 0.5 }); // 머무는 시간
});

// Section 5, 6, 7 : 공통 페이드인 애니메이션 함수화
const fadeSections = [
  { trigger: ".section-05", target: ".sec5-container", start: "top 60%" },
  { trigger: ".section-06", target: ".sec6-container", start: "top 60%" },
  { trigger: ".section-07", target: ".sec7-container", start: "top 50%" }
];

fadeSections.forEach(sec => {
  gsap.to(sec.target, {
    scrollTrigger: { trigger: sec.trigger, start: sec.start },
    opacity: 1, y: 0, duration: 1, ease: "power3.out"
  });
});


// =====================================================================
// [5] UI Components (슬라이더 및 3D 카드)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
  
  // Section 2 : Swiper 슬라이더 설정
  new Swiper(".mySwiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    pagination: { el: ".swiper-pagination", clickable: true },
  });

  // Section 4 : 3D 입체감 카드 Intersection Observer (스크롤 시 등장)
  const cards = document.querySelectorAll('.card-wrapper'); 
  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible'); 
        observer.unobserve(entry.target); 
      }
    });
  }, { threshold: 0.5 });

  cards.forEach(card => observer.observe(card));
});


// =====================================================================
// [6] Utilities (기타 기능)
// =====================================================================
// 푸터 TOP 버튼 이동 기능
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
}