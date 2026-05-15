// 모바일 메뉴 제어
const mMenuBtn = document.getElementById('mMenuBtn');
const mFsMenu = document.getElementById('mFsMenu');
const mFsClose = document.getElementById('mFsClose');

if(mMenuBtn) {
  mMenuBtn.addEventListener('click', () => mFsMenu.classList.add('active'));
}
if(mFsClose) {
  mFsClose.addEventListener('click', () => mFsMenu.classList.remove('active'));
}

// 기존 코드 하단에 추가
document.addEventListener("DOMContentLoaded", function() {
    // 폰트 로드 완료 후 실행 (텍스트 위치 계산 오류 방지)
    document.fonts.ready.then(() => {
        
        // 🛡️ [추가] 정보보안 컨설팅 본문 페이드인 애니메이션 (stagger 효과)
        const fadeElements = gsap.utils.toArray(".m-fade-in-item");

        if (fadeElements.length > 0) {
            gsap.to(fadeElements, {
                opacity: 1,
                y: 0,
                duration: 1.2, // 애니메이션 시간
                ease: "power3.out",
                stagger: 0.3, // 👈 핵심: 0.3초 간격으로 순차 등장
                scrollTrigger: {
                    trigger: ".m-sub-section",
                    start: "top 75%", // 화면의 75% 지점에 도달하면 애니메이션 시작
                    // toggleActions: "play none none reverse", // 스크롤 올리면 다시 사라지게
                    // markers: true, // 디버깅 시 주석 해제
                }
            });
        }
    });
});




const recFadeElements = gsap.utils.toArray(".m-rec-fade");

if (recFadeElements.length > 0) {
    gsap.to(recFadeElements, {
        opacity: 1,
        y: 0,
        duration: 1, // 개별 애니메이션 속도
        ease: "power3.out",
        stagger: 0.15, // 👈 0.15초 간격으로 카드가 하나씩 빠르게 올라옴
        scrollTrigger: {
            trigger: ".m-recommend-section",
            start: "top 80%", // 섹션이 화면의 80% 지점에 도달했을 때 실행
        }
    });
}



const achieveFadeElements = gsap.utils.toArray(".m-achieve-fade");

if (achieveFadeElements.length > 0) {
    gsap.to(achieveFadeElements, {
        opacity: 1,
        y: 0,
        duration: 1, 
        ease: "power3.out",
        stagger: 0.15, // 👈 카드가 0.15초 간격으로 다다닥 올라옴
        scrollTrigger: {
            trigger: ".m-achievement-section",
            start: "top 80%", // 섹션이 화면에 조금 진입하면 바로 시작
        }
    });
}