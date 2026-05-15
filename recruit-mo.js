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