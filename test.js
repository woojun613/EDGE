// GSAP 플러그인 등록 (최상단에 한 번만 선언)
gsap.registerPlugin(ScrollTrigger);

// =====================================================================
// [1] Custom Mouse Cursor (유령 커서 + 푸른 배경 글로우 완벽 연동)
// =====================================================================
const cursor = document.querySelector('.custom-cursor');
const glowCursor = document.querySelector('.bg-glow-cursor'); // 후광 커서 선택

if (cursor && glowCursor) {
  // 두 커서 모두 중심축 세팅
  gsap.set(cursor, { xPercent: -50, yPercent: -50 });
  gsap.set(glowCursor, { xPercent: -50, yPercent: -50 });

  // 1. 작은 기본 커서의 움직임
  let xTo = gsap.quickTo(cursor, "x", { duration: 0.15, ease: "power3" });
  let yTo = gsap.quickTo(cursor, "y", { duration: 0.15, ease: "power3" });

  // 2. 큰 후광 커서의 움직임 (묵직하고 부드럽게 뒤늦게 따라옴)
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
// [2] Section 2 : 시네마틱 인터루드 + 슬라이드 통합 스크롤 애니메이션
// =====================================================================
const sec2 = document.querySelector(".section-02");

if (sec2) {
  // 초기 상태 세팅 (vh 대신 픽셀 200으로 고정하여 계산 튕김 방지)
  gsap.set(".sec2-title", { y: 200 }); 
  gsap.set([".sec2-subtitle", ".sec2-desc", ".sec2-slider"], { opacity: 0, y: 40 });

  // 첫 번째 줄 스크롤 연동 (독립)
  gsap.fromTo(".title-line-1", 
    { opacity: 0, filter: "blur(20px)" }, 
    {
      opacity: 1, 
      filter: "blur(0px)",                
      scrollTrigger: {
        trigger: ".section-02",
        start: "top 85%", 
        end: "top 10%",   
        scrub: 1.5
      }
    }
  );

  // 2. 메인 타임라인 (핀)
  const sec2Tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-02",
      start: "top top", 
      end: "+=2000",    
      scrub: 1,
      pin: true
    }
  });

  sec2Tl
    // gsap.to 대신 .fromTo를 사용하여 시작값을 자물쇠처럼 잠가버립니다.
    .fromTo(".title-line-2", 
      { opacity: 0, filter: "blur(20px)" },
      { opacity: 1, filter: "blur(0px)", duration: 0.5 }
    )
    
    // 완성된 문장을 잠깐 감상하는 여백
    .to({}, { duration: 0.3 }) 
    
    // 타이틀 위로 올라감 (여기서도 fromTo로 순간이동 원천 차단!)
    .fromTo(".sec2-title", 
      { y: 200 }, 
      { y: 0, duration: 1.2, ease: "power3.inOut" }
    )
    
    // 서브타이틀, 설명, 슬라이드 페이드인
    .to([".sec2-subtitle", ".sec2-desc", ".sec2-slider"], { 
      opacity: 1, 
      y: 0, 
      duration: 1.5, 
      stagger: 0.2, 
      ease: "power3.out" 
    }, "-=0.8"); 
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

// 1. Section 3 : 패널 전환 (안전장치 추가!)
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

  // 브라우저가 렌더링될 때 불릿 4개를 직접 강제로 그려 넣습니다.
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

// Section 4 : 배경만 따로 움직이는 패럴랙스 효과
const parallaxCards = document.querySelectorAll(".card");

if (parallaxCards.length > 0) {
  // 1. VanillaTilt 초기화 (기본 기울기 설정)
  VanillaTilt.init(parallaxCards, {
    max: 15,
    speed: 400,
    glare: true,
    "max-glare": 0.2,
    reverse: true // 마우스 방향으로 기울어짐
  });

  // 2. 배경 이미지 이동 동기화
  parallaxCards.forEach(card => {
    card.addEventListener("tiltChange", (event) => {
      const { tiltX, tiltY } = event.detail;
      const bg = card.querySelector(".card-bg");
      
      // 기울기 값에 따라 배경을 반대 방향 혹은 같은 방향으로 이동
      // 숫자를 키울수록 배경이 더 많이 움직입니다.
      const moveX = -tiltX * 1.5; // 가로 이동량
      const moveY = -tiltY * 1.5; // 세로 이동량

      // 배경 이미지에만 이동 효과 적용 (scale 1.1 유지)
      bg.style.transform = `scale(1.1) translate3d(${moveX}px, ${moveY}px, 0)`;
    });

    // 마우스가 나가면 배경도 정중앙으로 복귀
    card.addEventListener("mouseleave", () => {
      const bg = card.querySelector(".card-bg");
      bg.style.transform = `scale(1.1) translate3d(0, 0, 0)`;
    });
  });
}


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
      scrollTrigger: { trigger: cardsList[1], start: "top 90%", end: "top 20%", scrub: 0.3 }
    }
  );

  // 2. SAFETY 텍스트 -> 3번째 카드(index 2)
  gsap.fromTo('.text-safety', 
    { opacity: 0, y: -100 }, 
    { opacity: 1, y: 150, ease: "none", 
      scrollTrigger: { trigger: cardsList[2], start: "top 90%", end: "top 20%", scrub: 0.3 }
    }
  );

  // 3. ON THE EDGE 텍스트 -> 4번째 카드(index 3)
  gsap.fromTo('.text-edge', 
    { opacity: 0, y: -170 }, 
    { opacity: 1, y: 80, ease: "none", 
      scrollTrigger: { trigger: cardsList[3], start: "top 90%", end: "top 20%", scrub: 0.3 }
    }
  );
  
}




// =====================================================================
// [8] Section 5 : 풀스크린 이미지 스크롤 축소 (위즈텍 직선 수축 방식)
// =====================================================================
const sec5 = document.querySelector('.section-05');

if (sec5) {
  const sec5Tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".section-05",
      start: "top top", 
      end: "+=1500",    
      scrub: 1,         
      pin: true,        
      anticipatePin: 1
    }
  });

  // width/height 대신 scale과 x(vw)만 사용하여 완벽한 일직선 구현!
  sec5Tl.to(".sec5-image-wrap", {
    scale: 0.45,         // (1 - 0.6 * progress)와 비슷한 45% 크기로 축소
    x: "15vw",           // 우측으로 15vw 만큼 이동 (원하는 위치에 맞게 숫자 조절 가능)
    borderRadius: "40px",// scale이 줄어들면 라운드도 작아보이므로 살짝 큰 값을 줍니다.
    ease: "none",        // 포물선 방지용 일직선 가속도
    duration: 1
  })
  // 이미지가 반쯤 줄어들었을 때 텍스트가 스르륵 나타나는 효과
  .to(".sec5-text", {
    opacity: 1,
    x: 0, 
    duration: 0.5,
    ease: "power2.out"
  }, "-=0.6"); 
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



// =====================================================================
// [추가] Hero Section 3D Particle Sphere (Vanilla Three.js 버전)
// =====================================================================
function initHeroThreeJS() {
    const container = document.getElementById('particle-canvas');
    if (!container) return;

    // 1. 기본 세팅 (Scene, Camera, Renderer)
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    // 2. 입자 데이터 생성
    const particleCount = 1500;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);
    const colorTool = new THREE.Color();

    const RADIUS = 2.3;

    for (let i = 0; i < particleCount; i++) {
        // 구형 분포 계산
        const u = Math.random();
        const v = Math.random();
        const theta = 2 * Math.PI * u;
        const phi = Math.acos(2 * v - 1);
        const r = RADIUS * Math.pow(Math.random(), 1/3);

        positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
        positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta);
        positions[i * 3 + 2] = r * Math.cos(phi);

        // 색상: 흰색 80%, 골드 20%
        const isGold = Math.random() < 0.2;
        colorTool.set(isGold ? "#4144F3" : "#65A7FF");
        colors[i * 3] = colorTool.r;
        colors[i * 3 + 1] = colorTool.g;
        colors[i * 3 + 2] = colorTool.b;
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
        size: 0.02,
        vertexColors: true,
        transparent: true,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const points = new THREE.Points(geometry, material);
    scene.add(points);

    // 3. 마우스 인터랙션 설정
    let mouseX = 0;
    let mouseY = 0;

    window.addEventListener('mousemove', (e) => {
        // 좌표를 -1 ~ 1 사이로 정규화
        mouseX = (e.clientX / window.innerWidth) * 2 - 1;
        mouseY = -(e.clientY / window.innerHeight) * 2 + 1;
    });

    // 4. 애니메이션 루프
    function animate() {
        requestAnimationFrame(animate);

        // 부드러운 회전 (마우스 반응)
        points.rotation.y += (mouseX * 0.3 - points.rotation.y) * 0.05;
        points.rotation.x += (-mouseY * 0.3 - points.rotation.x) * 0.05;
        
        // 미세한 자동 회전
        points.rotation.z += 0.001;

        // 입자들 미세하게 움직이기 (가두기 로직)
        const posArray = geometry.attributes.position.array;
        for (let i = 0; i < particleCount; i++) {
            posArray[i * 3] += (Math.random() - 0.5) * 0.002;
            posArray[i * 3 + 1] += (Math.random() - 0.5) * 0.002;
            posArray[i * 3 + 2] += (Math.random() - 0.5) * 0.002;

            const dist = Math.sqrt(
                posArray[i * 3] ** 2 + 
                posArray[i * 3 + 1] ** 2 + 
                posArray[i * 3 + 2] ** 2
            );

            if (dist > RADIUS) {
                posArray[i * 3] *= 0.99;
                posArray[i * 3 + 1] *= 0.99;
                posArray[i * 3 + 2] *= 0.99;
            }
        }
        geometry.attributes.position.needsUpdate = true;

        renderer.render(scene, camera);
    }

    // 창 크기 조절 대응
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    animate();
}

// 3D 입자 엔진 기동
initHeroThreeJS(); 