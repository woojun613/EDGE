gsap.registerPlugin(SplitText, ScrollTrigger);

document.addEventListener("DOMContentLoaded", function() {
    
    // [1] 메뉴 제어 로직 (애니메이션과 상관없이 독립적으로 작동해야 함)
    const mMenuBtn = document.getElementById('mMenuBtn');
    const mFsMenu = document.getElementById('mFsMenu');
    const mFsClose = document.getElementById('mFsClose');

    if(mMenuBtn && mFsMenu) {
        mMenuBtn.onclick = (e) => {
            e.preventDefault();
            mFsMenu.classList.add('active');
            document.body.style.overflow = 'hidden'; // 메뉴 열릴 때 배경 스크롤 방지
        };
    }

    if(mFsClose) {
        mFsClose.onclick = () => {
            mFsMenu.classList.remove('active');
            document.body.style.overflow = 'auto'; // 닫으면 스크롤 복구
        };
    }

    // [2] 텍스트 리빌 & 배경 고정 애니메이션
    function initReveal() {
        const containers = gsap.utils.toArray(".m-text-container");
        
        containers.forEach(container => {
            const text = container.querySelector(".m-split");
            gsap.set(container, { autoAlpha: 1 });

            const split = new SplitText(text, { type: "lines", linesClass: "m-line-child" });
            split.lines.forEach(line => {
                const wrapper = document.createElement('div');
                wrapper.className = 'm-line-wrapper';
                line.parentNode.insertBefore(wrapper, line);
                wrapper.appendChild(line);
            });
        });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: ".m-reveal-section",
                start: "top top",
                end: "bottom bottom",
                scrub: 1.5,
                pin: ".m-reveal-sticky",
                pinSpacing: true // 공간 확보
            }
        });

        tl.from(".first .m-line-child", { yPercent: 100, stagger: 0.1 })
          .to(".first", { opacity: 0, y: -30, duration: 0.5 }, "+=1")
          .from(".second .m-line-child", { yPercent: 100, stagger: 0.1 })
          .to(".second", { opacity: 0, y: -30, duration: 0.5 }, "+=1")
          .from(".third .m-line-child", { yPercent: 100, stagger: 0.1 })
          .to({}, { duration: 1 });
    }

    // 모든 리소스가 로드된 후 실행
    window.addEventListener('load', () => {
        setTimeout(initReveal, 300);
    });
});

// 상단 이동 함수
function mScrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}



document.addEventListener("DOMContentLoaded", function() {
    
    // (기존 메뉴 및 스태킹 로직 생략...)

    // [추가] "전문가들과 함께 하세요" 페이드인 로직
    if (document.querySelector('.m-fade-title')) {
        gsap.to(".m-fade-title", {
            opacity: 1,
            y: 0,
            duration: 1.5, /* 천천히 고급스럽게 올라오도록 1.5초 부여 */
            ease: "power3.out",
            scrollTrigger: {
                trigger: ".m-fade-section",
                start: "top 75%", // 화면의 75% 지점에 도달하면 스르륵 나타남
                // markers: true, // 필요 시 주석 해제하여 위치 확인
            }
        });
    }
});





document.addEventListener("DOMContentLoaded", function() {
    
    // (기존 메뉴, 리빌, 스태킹 로직 생략...)

    // ======================================================
    // 전문가 그룹 슬라이더 (자동재생 + 버튼 + 터치 스와이프)
    // ======================================================
    const track = document.getElementById('mExpertTrack');
    const cards = document.querySelectorAll('.m-expert-card');
    const prevBtn = document.getElementById('mExpertPrev');
    const nextBtn = document.getElementById('mExpertNext');
    
    if (track && cards.length > 0) {
        let currentIndex = 0;
        const totalCards = cards.length;
        let autoPlayInterval;

        // 슬라이드 이동 함수
        function moveSlider(index) {
            if (index < 0) index = totalCards - 1;
            if (index >= totalCards) index = 0;
            
            currentIndex = index;
            
            const cardWidth = cards[0].offsetWidth + 20; // 카드너비 + gap
            
            gsap.to(track, {
                x: -currentIndex * cardWidth,
                duration: 0.5, // 스와이프 시 쫀득하게 따라오도록 시간 약간 단축
                ease: "power2.out"
            });
        }

        // 자동 재생 로직
        function startAutoPlay() {
            stopAutoPlay();
            autoPlayInterval = setInterval(() => {
                moveSlider(currentIndex + 1);
            }, 4000);
        }

        function stopAutoPlay() {
            clearInterval(autoPlayInterval);
        }

        // 버튼 클릭 이벤트
        if(nextBtn) {
            nextBtn.addEventListener('click', () => {
                stopAutoPlay(); moveSlider(currentIndex + 1); startAutoPlay();
            });
        }
        if(prevBtn) {
            prevBtn.addEventListener('click', () => {
                stopAutoPlay(); moveSlider(currentIndex - 1); startAutoPlay();
            });
        }

        // 👆 [추가] 모바일 터치 스와이프 이벤트
        let touchStartX = 0;
        let touchEndX = 0;

        // 손가락이 닿았을 때
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            stopAutoPlay(); // 스와이프 중에는 자동재생 일시정지
        }, { passive: true });

        // 손가락이 떨어졌을 때
        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
            startAutoPlay(); // 터치가 끝나면 자동재생 재개
        }, { passive: true });

        function handleSwipe() {
            const swipeThreshold = 50; // 이 픽셀 이상 움직여야 슬라이드 넘김 처리
            
            if (touchStartX - touchEndX > swipeThreshold) {
                // 오른쪽에서 왼쪽으로 밀었을 때 (다음 슬라이드)
                moveSlider(currentIndex + 1);
            } else if (touchEndX - touchStartX > swipeThreshold) {
                // 왼쪽에서 오른쪽으로 밀었을 때 (이전 슬라이드)
                moveSlider(currentIndex - 1);
            }
        }

        // 초기 실행
        startAutoPlay();
        window.addEventListener('resize', () => moveSlider(currentIndex));
    }
});