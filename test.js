// ==================================================
// 🎬 section-01 메인 인트로 & 스마트 헤더 통합
// ==================================================

// 1. 깜빡임 방지: 화면에 뜨기 전에 미리 숨겨두기
gsap.set(".header", { y: -80, opacity: 0 });
gsap.set(".sec1-title", { y: 50, opacity: 0 });
gsap.set(".sec1-desc", { y: 30, opacity: 0 });
gsap.set(".sec1-btn", { scale: 0.8, opacity: 0 });

// 2. 인트로 타임라인 애니메이션
window.addEventListener("load", () => {
  const introTl = gsap.timeline();

  introTl
    .to(".header", { y: 0, opacity: 1, duration: 1, ease: "power3.out" })
    .to(".sec1-title", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.5")
    .to(".sec1-desc", { y: 0, opacity: 1, duration: 1, ease: "power3.out" }, "-=0.7")
    .to(".sec1-btn", { scale: 1, opacity: 1, duration: 0.8, ease: "back.out(1.7)" }, "-=0.6");
});

// 3. 스마트 헤더 (GSAP으로 처리해서 충돌 0%)
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
  const currentScrollY = window.scrollY;
  
  // 스크롤을 내릴 때 (헤더 높이 80px 이상 내려가면 위로 숨김)
  if (currentScrollY > lastScrollY && currentScrollY > 80) {
    gsap.to('.header', { y: -80, duration: 0.3, ease: "power2.out" }); 
  } 
  // 스크롤을 올릴 때 (다시 슥~ 나타남)
  else {
    gsap.to('.header', { y: 0, duration: 0.3, ease: "power2.out" }); 
  }
  lastScrollY = currentScrollY;
});
// ==================================================
// 🎬 메인 인트로 & 스마트 헤더 끝
// ==================================================





// ==================================================
// Custom Mouse Cursor 시작
// ==================================================
const cursor = document.querySelector('.custom-cursor');

// 1. 커서 중심축 설정
gsap.set(cursor, { xPercent: -50, yPercent: -50 });

// 2. 성능 최적화: gsap.quickTo() 사용
let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

// 3. 마우스 이동에 따라 커서 따라가기
window.addEventListener("mousemove", (e) => {
  xTo(e.clientX);
  yTo(e.clientY);
});

// 4. 화면 밖 처리
document.body.addEventListener("mouseleave", () => {
  gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
});
document.body.addEventListener("mouseenter", () => {
  gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
});

// 5. 클릭(Mousedown) 효과
window.addEventListener("mousedown", () => {
  gsap.to(cursor, { scale: 0.8, duration: 0.1 }); 
});
window.addEventListener("mouseup", () => {
  gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }); 
});

// 호버 대상을 확대하는 부분
const hoverElements = document.querySelectorAll(
  '.sec1-btn, ' +                  // 섹션 1 도입문의 버튼
  '.card-slide, ' +                // 섹션 2 슬라이드 카드
  '.swiper-pagination-bullet, ' +  // 섹션 2 슬라이드 불릿 (점)
  '.card-wrapper, ' +              // 섹션 4 3D 카드
  '.sec7-btn, ' +                  // 섹션 7 문의하기 버튼
  '.header-logo a, ' +             // 헤더 로고 링크
  '.gnb a, ' +                     // 헤더 네비게이션 메뉴
  '.header-btn, ' +                // 헤더 도입문의 버튼
  'a, button'                      // 기타 링크 및 버튼
);

hoverElements.forEach((el) => {
  el.addEventListener('mouseenter', () => {
    cursor.classList.add('is-hovering');
  });
  el.addEventListener('mouseleave', () => {
    cursor.classList.remove('is-hovering');
  });
});
// ==================================================
// Custom Mouse Cursor 끝
// ==================================================





// ==================================================
// GSAP 스크롤 핀 & 패널 전환 애니메이션 (Section 3) 시작
// ==================================================
gsap.registerPlugin(ScrollTrigger);

const panels = gsap.utils.toArray(".gradient-box.panel");

// 첫 번째를 제외한 나머지 박스들을 JS로 다시 한번 확실히 숨김 처리
gsap.set(panels.slice(1), { autoAlpha: 0, scale: 0.8 });

// 스크롤 타임라인 생성
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: ".section-03", // 섹션 3을 기준으로
    start: "center center", // 섹션 3의 중앙이 화면 중앙에 닿으면 시작
    end: "+=2000", // 약 2000px 만큼 스크롤 하는 동안 애니메이션 진행 (수치 조절로 속도 조절 가능)
    scrub: 1, // 스크롤을 올리고 내릴 때 부드럽게 애니메이션 따라감
    pin: true, // 애니메이션이 끝날 때까지 화면 고정
    anticipatePin: 1, // 핀 고정 시점에서 약간의 여유를 줘서 깔끔한 핀 효과
  }
});

// 각 패널별 애니메이션 설정
panels.forEach((panel, i) => {
  if (i !== 0) {
    // 이전 패널은 사라지고 작아짐
    tl.to(panels[i - 1], { autoAlpha: 0, scale: 0.8, duration: 1 }, `step${i}`)
    // 현재 패널은 나타나고 커짐
      .to(panel, { autoAlpha: 1, scale: 1, duration: 1 }, `step${i}`);
  }
  // 사용자가 내용을 읽을 수 있도록 각 패널마다 살짝 머무는 시간(pause) 추가
  tl.to({}, {duration: 0.5});
});
// ==================================================
// GSAP 스크롤 핀 & 패널 전환 애니메이션 (Section 3) 끝
// ==================================================




// ==================================================
// section-07 페이드인 애니메이션 시작
// ==================================================
gsap.to(".sec7-container", {
  scrollTrigger: {
    trigger: ".section-07",
    start: "top 50%", // 섹션이 화면 아래에서 50% 정도 올라왔을 때 실행
  },
  opacity: 1,
  y: 0,
  duration: 1,
  ease: "power3.out"
});
// ==================================================
// section-07 페이드인 애니메이션 끝
// ==================================================





document.addEventListener("DOMContentLoaded", function() {
  // ==================================================
  // section-02 Swiper 슬라이더 설정
  // ==================================================
  var swiper = new Swiper(".mySwiper", {
    slidesPerView: "auto", // 카드의 너비(450px)에 맞춰서 화면에 보여줌
    centeredSlides: true,  // 활성화된 슬라이드를 항상 중앙에 배치
    spaceBetween: 30,      // 카드와 카드 사이의 간격
    loop: true,            // 무한 반복
    grabCursor: true,      // 마우스 올렸을 때 손바닥(드래그) 모양
    autoplay: {
      delay: 3000,         // 3초마다 자동 슬라이드
      disableOnInteraction: false, // 마우스로 만진 후에도 자동 슬라이드 유지
    },
    pagination: {
      el: ".swiper-pagination",
      clickable: true,     // 불릿 클릭 시 이동 가능
    },
  });
  // ==================================================
  // section-02 Swiper 슬라이더 설정
  // ==================================================




  // ==================================================
  // 3D 입체감 카드 레이아웃 section-04
  // ==================================================
  const cards = document.querySelectorAll('.card-wrapper'); 

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible'); 
        observer.unobserve(entry.target); 
      }
    });
  }, {
    root: null,
    rootMargin: '0px',
    threshold: 0.5
  });

  cards.forEach(card => {
    observer.observe(card);
  });
  // ==================================================
  // 3D 입체감 카드 레이아웃 section-04
  // ==================================================
});





// ==================================================
// footer - TOP ↑ 버튼 최상단 이동 기능 시작
// ==================================================
function scrollToTop() {
  window.scrollTo({
    top: 0,
    behavior: 'smooth' // 'auto'로 하면 바로 올라갑니다.
  });
}
// ==================================================
// footer - TOP ↑ 버튼 최상단 이동 기능 끝
// ==================================================