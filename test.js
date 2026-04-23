// GSAP 플러그인 등록 (최상단에 한 번만 선언)
gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// [1] Custom Mouse Cursor (유령 커서 + 푸른 배경 글로우 완벽 연동)
// =====================================================================
const cursor = document.querySelector('.custom-cursor');
const glowCursor = document.querySelector('.bg-glow-cursor'); // 🔥 후광 커서 선택

if (cursor && glowCursor) {
  // 두 커서 모두 중심축 세팅
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  gsap.set(glowCursor, { xPercent: -50, yPercent: -50 });

  // 1. 작은 기본 커서의 움직임 (빠릿빠릿함)
  let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  // 🔥 2. 큰 후광 커서의 움직임 (묵직하고 부드럽게 뒤늦게 따라옴)
  let glowXTo = gsap.quickTo(glowCursor, "x", { duration: 0.8, ease: "power3.out" });
  let glowYTo = gsap.quickTo(glowCursor, "y", { duration: 0.8, ease: "power3.out" });

  let isFirstMove = true;

  // 마우스 이동 시
  window.addEventListener("mousemove", (e) => {
    if (isFirstMove) {
      // 처음 움직일 땐 마우스 위치로 둘 다 '순간이동'
      gsap.set(cursor, { x: e.clientX, y: e.clientY });
      gsap.set(glowCursor, { x: e.clientX, y: e.clientY });
      
      // 서서히 나타남
      gsap.to(cursor, { opacity: 1, duration: 0.3 });
      gsap.to(glowCursor, { opacity: 1, duration: 1 }); // 후광은 더 천천히 켜짐
      isFirstMove = false;
    } else {
      // 그 이후부턴 마우스를 따라다님
      xTo(e.clientX);
      yTo(e.clientY);
      glowXTo(e.clientX);
      glowYTo(e.clientY);
    }
  });

  // 화면 밖으로 나갈 때 숨김
  document.body.addEventListener("mouseleave", () => {
    gsap.to(cursor, { scale: 0, opacity: 0, duration: 0.2 });
    gsap.to(glowCursor, { opacity: 0, duration: 0.5 });
  });
  
  // 다시 들어올 때 표시
  document.body.addEventListener("mouseenter", () => {
    if (!isFirstMove) {
      gsap.to(cursor, { scale: 1, opacity: 1, duration: 0.2 });
      gsap.to(glowCursor, { opacity: 1, duration: 0.5 });
    }
  });

  // 클릭 시 스케일 축소/복구 (작은 커서만 적용)
  window.addEventListener("mousedown", () => gsap.to(cursor, { scale: 0.8, duration: 0.1 }));
  window.addEventListener("mouseup", () => gsap.to(cursor, { scale: 1, duration: 0.15, ease: "back.out(1.7)" }));

  // 호버 요소 확대 효과
  const hoverElements = document.querySelectorAll(
    '.header-logo a, .gnb a, .header-btn, .tab-item, .card-wrapper, .sec7-btn, a, button'
  );
  
  const mapArea = document.querySelector('.sec6-map');
  if (mapArea) {
    mapArea.addEventListener('mouseenter', () => {
      gsap.to(cursor, { opacity: 0, duration: 0.2 }); 
      gsap.to(glowCursor, { opacity: 0, duration: 0.4 }); // 지도 위에선 후광도 같이 꺼줌
    });
    mapArea.addEventListener('mouseleave', () => {
      gsap.to(cursor, { opacity: 1, duration: 0.2 }); 
      gsap.to(glowCursor, { opacity: 1, duration: 0.4 }); 
      gsap.set(cursor, { x: event.clientX, y: event.clientY }); 
      gsap.set(glowCursor, { x: event.clientX, y: event.clientY }); 
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

// 🟢 1. Section 3 : 패널 전환 (안전장치 추가!)
const sec3Element = document.querySelector(".section-03");

if (sec3Element) {
  // .section-03이 있는 메인 페이지에서만 실행됩니다.
  const panels = gsap.utils.toArray(".gradient-box.panel");
  gsap.set(panels.slice(1), { autoAlpha: 0, scale: 0.8 }); 

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
    tl.to({}, { duration: 0.5 }); 
  });
}


// =====================================================================
// [5] UI Components (슬라이더 및 3D 카드)
// =====================================================================
document.addEventListener("DOMContentLoaded", function() {
  
  const mySwiper = new Swiper(".mySwiper", {
    slidesPerView: "auto",
    centeredSlides: true,
    spaceBetween: 30,
    loop: true,
    grabCursor: true,
    autoplay: { delay: 3000, disableOnInteraction: false },
    on: {
      slideChange: function () {
        // 8개 슬라이드(0~7)가 돌아가더라도 인덱스를 4로 나누어 0, 1, 2, 3 패턴으로 인식하게 만듦
        const activeIndex = this.realIndex % 4; 
        const bullets = document.querySelectorAll(".swiper-pagination-bullet");
        bullets.forEach((bullet, index) => {
          if (index === activeIndex) {
            bullet.classList.add("swiper-pagination-bullet-active");
          } else {
            bullet.classList.remove("swiper-pagination-bullet-active");
          }
        });
      }
    }
  });

  // 🔥 브라우저가 렌더링될 때 불릿 4개를 직접 강제로 그려 넣습니다.
  const paginationContainer = document.querySelector(".swiper-pagination");
  if (paginationContainer) {
    paginationContainer.innerHTML = ""; // 기존 내용 비우기
    
    for (let i = 0; i < 4; i++) {
      const bullet = document.createElement("span");
      bullet.classList.add("swiper-pagination-bullet");
      
      // 첫 번째 불릿에는 활성화 클래스 부여
      if (i === 0) bullet.classList.add("swiper-pagination-bullet-active");
      
      // 불릿 클릭 시 해당 슬라이드로 부드럽게 이동하는 기능 추가
      bullet.addEventListener("click", () => {
        mySwiper.slideToLoop(i);
      });
      
      paginationContainer.appendChild(bullet);
    }
  }

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




// =====================================================================
// [8] Section 5 : 풀스크린 이미지 스크롤 축소 패럴랙스
// =====================================================================
const sec5 = document.querySelector('.section-05');

if (sec5) {
  const sec5Tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-05",
      start: "top top", // 섹션이 화면 꼭대기에 닿으면 핀(Pin) 고정 시작!
      end: "+=1500",    // 스크롤을 1500px 내릴 동안 애니메이션 진행
      scrub: 1,         // 마우스 휠에 부드럽게 연동
      pin: true         // 화면을 꽉 잡고 안 넘어가게 고정
    }
  });

  // 1. 이미지가 시안의 우측 위치로 작아지는 효과
  sec5Tl.to(".sec5-image-wrap", {
    width: "600px",              // 줄어들 최종 가로 크기 (시안 비율)
    height: "450px",             // 줄어들 최종 세로 크기
    top: "50%",                  // 화면 세로 중앙
    left: "calc(50%)",    // 1200px 컨테이너 기준 우측에 완벽하게 정렬되는 수식
    yPercent: -50,               // 중심축을 완벽히 가운데로
    borderRadius: "20px",        // 작아지면서 모서리가 둥글어짐
    duration: 1,
    ease: "power2.inOut"
  })
  // 2. 이미지가 반쯤 줄어들었을 때 텍스트가 스르륵 나타나는 효과
  .to(".sec5-text", {
    opacity: 1,
    x: 0, // 원래 위치로 이동
    duration: 0.5,
    ease: "power2.out"
  }, "-=0.6"); // 앞 애니메이션이 끝나기 0.6초 전에 시작!
}

// =====================================================================
// [마지막] Section 6, 7 : 공통 페이드인 애니메이션 (안전장치 포함)
// =====================================================================
const fadeSections = [
  { trigger: ".section-06", target: ".sec6-container", start: "top 60%" },
  { trigger: ".section-07", target: ".sec7-container", start: "top 50%" }
];

fadeSections.forEach(sec => {
  const triggerElement = document.querySelector(sec.trigger);
  
  if (triggerElement) {
    gsap.to(sec.target, {
      scrollTrigger: { trigger: sec.trigger, start: sec.start },
      opacity: 1, 
      y: 0, 
      duration: 1, 
      ease: "power3.out"
    });
  }
});