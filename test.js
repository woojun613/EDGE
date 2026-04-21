// GSAP 플러그인 등록 (최상단에 한 번만 선언)
gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// [1] Custom Mouse Cursor (유령 커서 날아옴 방지 완벽 버전)
// =====================================================================
const cursor = document.querySelector('.custom-cursor');

if (cursor) {
  // 커서 중심축 세팅
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  let isFirstMove = true; // 🔥 처음 마우스를 움직였는지 체크하는 스위치

  // 마우스 이동 시 좌표 업데이트 및 커서 나타내기
  window.addEventListener("mousemove", (e) => {
    if (isFirstMove) {
      // 🔥 1. 처음 움직일 때는 0,0에서 날아오지 못하도록 마우스 위치로 '순간이동' 시킵니다.
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      // 🔥 2. 제자리에 순간이동한 상태에서 부드럽게 나타나게 합니다.
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      isFirstMove = false;
    } else {
      // 3. 두 번째 움직임부터는 원래대로 부드럽게 마우스를 따라다니게 합니다.
      xTo(e.clientX);
      yTo(e.clientY);
    }
  });

  // 화면 밖으로 나갈 때 숨김 / 들어올 때 표시
  document.body.addEventListener("mouseleave", () => {
    gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
  });
  
  document.body.addEventListener("mouseenter", () => {
    if (!isFirstMove) {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
    }
  });

  // 클릭 시 스케일 축소/복구
  window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
  window.addEventListener("mouseup", () => gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }));

  // 호버 요소 확대 효과
  const hoverElements = document.querySelectorAll(
    '.header-logo a, .gnb a, .header-btn, .tab-item, .card-wrapper, .sec7-btn, a, button'
  );
  
  const mapArea = document.querySelector('.sec6-map');
  if (mapArea) {
    mapArea.addEventListener('mouseenter', () => {
      // 지도 영역에 들어오면 커스텀 커서를 투명하게 숨김
      gsap.to(cursor, { opacity: 0, duration: 0.2 }); 
    });
    
    mapArea.addEventListener('mouseleave', () => {
      // 지도 영역에서 빠져나오면 커스텀 커서를 다시 보여줌
      gsap.to(cursor, { opacity: 1, duration: 0.2 }); 
      // 빠져나온 위치로 즉시 순간이동 시켜서 자연스럽게 연결
      gsap.set(cursor, { x: event.clientX, y: event.clientY }); 
    });
  }

  hoverElements.forEach((el) => {
    el.addEventListener('mouseenter', () => cursor.classList.add('is-hovering'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('is-hovering'));
  });
}


// =====================================================================
// interlude
// =====================================================================
// 인터루드 섹션: 스크롤에 따라 텍스트 한 줄씩 등장 (블러 효과)
const interludeSec = document.querySelector(".sub-section-interlude");
if (interludeSec) {
  // GSAP 타임라인 생성
  const interludeTl = gsap.timeline({
    scrollTrigger: {
      trigger: ".sub-section-interlude",
      start: "top top", // 섹션 상단이 화면 상단에 닿을 때 실행
      end: "+=1500", // 애니메이션 진행 스크롤 길이 (스크롤 양을 조절하여 속도 변경 가능)
      scrub: true, // 스크롤에 맞춰 애니메이션 진행
      pin: true, // 섹션 고정
      anticipatePin: 1, // 고정 시 깜빡임 방지
    }
  });

  interludeTl
    // 첫 번째 줄 등장
    .to(".interlude-title", {
      opacity: 1,
      filter: "blur(0px)", // 블러가 걷히며 뚜렷해짐
      y: 0, // 원래 위치로 올라옴
      duration: 1,
      ease: "power2.out"
    })
    // 두 번째 줄 등장
    .to(".interlude-sub-title", {
      opacity: 1,
      filter: "blur(0px)", // 블러가 걷히며 뚜렷해짐
      y: 0, // 원래 위치로 올라옴
      duration: 1,
      ease: "power2.out"
    }, "-=0.5"); // 첫 번째 애니메이션 끝나기 0.5초 전에 시작 (순차적 등장 느낌)
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


// =====================================================================
// [7] 3D 카드 배경 타이포그래피 (순서 오류 및 타이틀 침범 완벽 해결)
// =====================================================================
const cardsList = gsap.utils.toArray('.section-04 .card-wrapper');
const bgTexts = gsap.utils.toArray('.bg-text');

if (cardsList.length > 0 && bgTexts.length > 0) {
  
  // 1. SECURING 텍스트 -> 2번째 카드(index 1)
  gsap.fromTo('.text-securing', 
    { opacity: 0, y: -100 }, 
    { opacity: 1, y: 150, ease: "none", 
      scrollTrigger: { trigger: cardsList[1], start: "top 80%", end: "center 30%", scrub: 1.5 }
    }
  );

  // 2. SAFETY 텍스트 -> 3번째 카드(index 2)
  gsap.fromTo('.text-safety', 
    { opacity: 0, y: -100 }, 
    { opacity: 1, y: 150, ease: "none", 
      scrollTrigger: { trigger: cardsList[2], start: "top 80%", end: "center 30%", scrub: 1.5 }
    }
  );

  // 3. ON THE EDGE 텍스트 -> 4번째 카드(index 3)
  gsap.fromTo('.text-edge', 
    { opacity: 0, y: -170 }, 
    { opacity: 1, y: 80, ease: "none", 
      scrollTrigger: { trigger: cardsList[3], start: "top 80%", end: "center 30%", scrub: 1.5 }
    }
  );
  
}