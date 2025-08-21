// 플러그인 등록
document.addEventListener("DOMContentLoaded", () => {
  gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

  // fixedElements 옵션 사용을 위한 ScrollSmoother 인스턴스
  ScrollSmoother.create({
    wrapper: '#smooth-wrapper',
    content: '#smooth-content',
    smooth: 2,
    effects: true
  });
    
  // ============ section-01 JS
  const introTl = gsap.timeline();

  introTl.fromTo ( ".title-1",
    { transformOrigin: "center bottom", autoAlpha: 0, yPercent: 50 },
    { autoAlpha: 1, yPercent: 0, duration: 0.5, delay: 0.5}
  ).fromTo ( ".title-2",
    { transformOrigin: "center bottom", autoAlpha: 0, xPercent: 20 },
    { autoAlpha: 1, xPercent: 0, duration: 0.5}
  ).fromTo ( ".title-3",
    { transformOrigin: "center bottom", autoAlpha: 0, xPercent: -20 },
    { autoAlpha: 1, xPercent: 0, duration: 0.5}
  ).fromTo ( ".title-4",
    { transformOrigin: "center bottom", autoAlpha: 0, yPercent: 50 },
    { autoAlpha: 1, yPercent: 0, duration: 0.5}
  ).fromTo ( ".a-1-btn",
    { transformOrigin: "center bottom", autoAlpha: 0, yPercent: 50 },
    { autoAlpha: 1, yPercent: 0, duration: 0.5}
  );


  // ============ section-02 JS
  const boxes = gsap.utils.toArray([".section-02-title", ".b-1-box1", ".b-1-box2", ".b-1-box3"]);

  boxes.forEach(box => {
    gsap.fromTo(
      box,
      { autoAlpha: 0},
      {
        autoAlpha: 1,
        duration: 1,
        scrollTrigger: {
          scrub: 1.5,
          trigger: box,
          start: "center 90%",
          end: "center top"
        }
      }
    );
  });

  
  // ============ section-05 JS
  const accorTl = gsap.timeline({
    scrollTrigger: {
      trigger: '.accordions',
      pin: true,
      anticipatePin: 0.1,
      start: 'top 90px',
      end: 'bottom top',
      scrub: 1,
      ease: 'linear'
    }
  })

  accorTl.to('.accordion .text', {
    height: 0,
    paddingBottom: 0,
    opacity: 0,
    stagger: .5
  })
  accorTl.to('.accordion', {
    marginBottom: -15,
    stagger: .5
  }, '<')


  // ============ section-03 JS
  const boxes3 = gsap.utils.toArray([".section-03-title", "#sec01", "#hor", "#sec06"]);

  boxes3.forEach(box => {
    gsap.fromTo(
      box,
      { autoAlpha: 0},
      {
        autoAlpha: 1,
        duration: 1,
        scrollTrigger: {
          scrub: 1.5,
          trigger: box,
          start: "center 100%",
          end: "center center"
        }
      }
    );
  });

  const hor = document.querySelector("#hor");
  const sections = gsap.utils.toArray("#hor > section");

  gsap.to(sections, {
    xPercent: -100 * (sections.length - 1),
    ease: "none",
    scrollTrigger: {
      trigger: hor,
      start: "top top",
      end: () => "+=" + (hor.offsetWidth - innerWidth),
      pin: true,
      scrub: 0.5,
      snap: {
        snapTo: 1 / (sections.length - 1),
        inertia: false,
        duration: { min: 0.1, max: 0.1 },
      },
      invalidateOnRefresh: true,
      // anticipatePin: 1,
    },
  });


  // =============== section-04 스케일 컨텐츠 ================
  const scaieSections = gsap.utils.toArray(".scale-box");

  scaieSections.forEach(section => {
    const text = section.querySelector(".scale-content"),
    image = section.querySelector(".scale-img");
    
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        pin: true,
        anticipatePin: 0.5,
        scrub: 1,
        start: "top top",
        end: "+=3000"
      }
    });

    tl.from(text, {opacity: 0, y: 100})
    .from(image, {scale: 0.5, ease: "linear", duration: 1})
    // .to(text, {opacity: 0, y: -100, ease: "power1.in"}); 사라지는거
  });

  // =============== section-04 3d 슬라이드 ================
  class Card {
    constructor(node, position) {
      this.node = node;
      this.position = position;
    }

    nextPosition() {
      let nextPosition = 1;
      if (this.position != 5) {
        nextPosition = this.position + 1;
      }
      return nextPosition;
    }

    prevPosition() {
      let prevPosition = 5;
      if (this.position != 1) { 
        prevPosition = this.position - 1;
      }
      return prevPosition;
    }

    moveNext() {
      this.node.classList.replace(
        `position${this.position}`,
        `position${this.nextPosition()}`
      );

      this.position = this.nextPosition();
    }

    movePrev() {
      this.node.classList.replace(
        `position${this.position}`,
        `position${this.prevPosition()}`
      );

      this.position = this.prevPosition();
    }
  }

  const [prev, next] = document.querySelectorAll("i");
  const gallery = document.querySelector(".gallery");
  const cards = [];
  let start;

  document.querySelectorAll(".card-3d").forEach((e, pos = 0) => {
    pos += 1;
    cards.push(new Card(e, pos));
  });

  next.addEventListener("click", () => {
    cards.forEach((c) => {
      c.moveNext();
    });
  });

  prev.addEventListener("click", () => {
    cards.forEach((c) => {
      c.movePrev();
    });
  });

  gallery.addEventListener("touchstart", (s) => {
    start = s.targetTouches[0].screenX;
  });

  gallery.addEventListener("touchend", (e) => {
    let end = e.changedTouches[0].screenX;
    const range = Math.abs(start - end);

    if (range > 30) {
      if (start < end) {
        cards.forEach((c) => {
          c.moveNext();
        });
      }

      if (start > end) {
        cards.forEach((c) => {
          c.movePrev();
        });
      }
    }
  });
});

// ============ OwlCarousel2
$('#owl-banner-edge').owlCarousel({
  autoplay:true,
  autoplayTimeout:3000,
  autoplayHoverPause:true,
  loop:true,
  margin:10,
  nav:true,
  responsive:{
    0:{ items:1 },
    600:{ items:2 },
    1000:{ items:3 }
  }
});

// ============ 오늘 하루 그만보기
const cookieName = 'hidePopupToday';

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "; expires=" + date.toUTCString();
  document.cookie = name + "=" + (value || "")  + expires + "; path=/";
}

function getCookie(name) {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
}

if (getCookie(cookieName)) {
  $('.popup-wrap').hide();
} else {
  $('.popup-wrap').show();
}

$('#close-today').on('click', function() {
  setCookie(cookieName, 'true', 1);
  $('.popup-wrap').hide();
});

$(".popup-close").click(function() {
  $(".popup-wrap").hide();

});
