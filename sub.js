// GSAP 플러그인 등록 (최상단에 한 번만 선언)
gsap.registerPlugin(ScrollTrigger);




// =====================================================================
// [0] Hero Section Load Animation (페이지 로드 시 히어로 섹션 등장)
// =====================================================================
// 페이지가 열리자마자 순차적으로 실행될 타임라인 생성
const heroTl = gsap.timeline();

heroTl
  // 1. 'SERVICE' 서브타이틀 등장
  .from(".sub-subtitle", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out",
    delay: 0.2 // 페이지 로드 후 0.2초 살짝 대기 후 시작
  })
  // 2. 메인 타이틀 등장 ("기술부터 사람까지...")
  .from(".sub-title", {
    opacity: 0,
    y: 30,
    duration: 0.8,
    ease: "power3.out"
  }, "-=0.6") // 앞의 애니메이션이 끝나기 0.6초 전에 겹쳐서 자연스럽게 시작
  // 3. 하단 탭 메뉴들 차례대로 등장
  .from(".sub-hero-tabs .tab-item", {
    opacity: 0,
    y: 20,
    duration: 0.6,
    ease: "power3.out",
    stagger: 0.1 // 각 탭 메뉴가 0.1초 간격으로 순차적으로 등장하는 마법의 속성!
  }, "-=0.4")
  // 4. section 01의 플로팅 오브젝트 등장 (히어로 타이틀과 살짝 겹치게)
  .from(".floating-obj", {
    opacity: 0,
    duration: 0.5, // 1.5초 동안 아주 천천히 고급스럽게 등장
    ease: "power2.inOut" // 부드럽게 시작해서 부드럽게 끝남
  }, "-=0.2");




// =====================================================================
// [0.5] Parallax Hero Content (히어로 배경은 고정, 내용물만 스크롤 1:1 연동)
// =====================================================================
const heroContainer = document.querySelector(".sub-hero-container");

if (heroContainer) {
  gsap.to(heroContainer, {
    y: -1500, // 충분히 큰 값 (위로 끌어올림)
    ease: "none",
    scrollTrigger: {
      trigger: "body",
      start: "top top",
      end: "+=1500", // 🔥 핵심: y 이동값(-1500)과 똑같이 맞춰주면 스크롤 속도와 1:1로 완벽하게 똑같이 올라갑니다!
      scrub: true
    }
  });
}




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
// let lastScrollY = window.scrollY;

// window.addEventListener('scroll', () => {
//   const currentScrollY = window.scrollY;
//   // 스크롤 내릴 때 (80px 이상) 숨김, 올릴 때 나타남
//   if (currentScrollY > lastScrollY && currentScrollY > 80) {
//     gsap.to('.header', { y: -80, duration: 0.3, ease: "power2.out" }); 
//   } else {
//     gsap.to('.header', { y: 0, duration: 0.3, ease: "power2.out" }); 
//   }
//   lastScrollY = currentScrollY;
// });


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

// 3. 서브페이지 Section 03: 추천 대상 박스 순차적 등장 애니메이션
const recommendBoxes = gsap.utils.toArray('.recommend-box');
if (recommendBoxes.length > 0) {
  recommendBoxes.forEach((box, i) => {
    gsap.from(box, {
      scrollTrigger: {
        trigger: box,
        start: "top 90%", // 박스가 화면 아래에서 90% 지점에 올 때 실행
      },
      opacity: 0,
      x: 50, // 살짝 오른쪽(50px)에 있다가 원래 자리로 들어옴
      duration: 0.8,
      ease: "power3.out",
      delay: i * 0.05, // 이전 박스보다 0.05초 늦게 출발하여 계단식 효과 연출
      clearProps: "transform"
    });
  });
}

// 4. 서브페이지 Section 04: 성과 카드 2x2 순차적 등장 애니메이션
const outcomeCards = gsap.utils.toArray('.outcome-card');
if (outcomeCards.length > 0) {
  outcomeCards.forEach((card, i) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%", // 카드가 화면 아래에서 85% 지점에 올 때 실행
      },
      opacity: 0,
      y: 40, // 40px 아래에서 위로 올라옴
      duration: 0.8,
      ease: "power3.out",
      delay: (i % 2) * 0.15, // 가로줄 단위로 엇갈리게 등장하도록 딜레이 계산
      clearProps: "transform"
    });
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




// =====================================================================
// [5] Parallax Animation (패럴랙스 스크롤 효과)
// =====================================================================
const floatingWrapper = document.querySelector(".floating-wrapper");

if (floatingWrapper) {
  gsap.to(floatingWrapper, {
    y: -350, // 스크롤을 내릴 때 위로 250px 만큼 더 빠르게 이동합니다. (숫자를 키울수록 더 빨리 올라감)
    ease: "none",
    scrollTrigger: {
      trigger: ".sub-section-01",
      start: "top bottom", // 섹션이 화면 아래에서 보이기 시작할 때 작동
      end: "bottom top",   // 섹션이 화면 위로 완전히 사라질 때 종료
      scrub: 1 // 스크롤 속도에 맞춰 부드럽게(1초 지연) 따라가기
    }
  });
}





// =====================================================================
// [6] Sticky Tab Bar Animation (상단 고정 탭 메뉴)
// =====================================================================
const stickyTabBar = document.querySelector('.sticky-tab-bar');
const heroTabs = document.querySelector('.sub-hero-tabs');

if (stickyTabBar && heroTabs) {
  ScrollTrigger.create({
    trigger: heroTabs,
    start: "top 20px", // 원본 메뉴가 상단(20px 근처)에 닿을 즈음 발동
    onEnter: () => stickyTabBar.classList.add('is-visible'), // 스크롤을 내리면 촥! 내려옴
    onLeaveBack: () => stickyTabBar.classList.remove('is-visible') // 스크롤을 올리면 다시 숨김
  });
}