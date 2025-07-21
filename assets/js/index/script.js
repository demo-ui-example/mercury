import { preloadImages } from "../../libs/utils.js";

("use strict");
$ = jQuery;

// setup lenis
const lenis = new Lenis();
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((time) => {
  lenis.raf(time * 1000);
});

gsap.ticker.lagSmoothing(0);
// end lenis

// dropdown

function customDropdown() {
  const dropdowns = document.querySelectorAll(".dropdown-custom");

  dropdowns.forEach((dropdown) => {
    const btnDropdown = dropdown.querySelector(".dropdown-custom-btn");
    const dropdownMenu = dropdown.querySelector(".dropdown-custom-menu");
    const dropdownItems = dropdown.querySelectorAll(".dropdown-custom-item");
    const valueSelect = dropdown.querySelector(".value-select");

    // Toggle dropdown on button click
    btnDropdown.addEventListener("click", function (e) {
      e.stopPropagation();
      closeAllDropdowns(dropdown);
      dropdownMenu.classList.toggle("dropdown--active");
      btnDropdown.classList.toggle("--active");
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", function () {
      closeAllDropdowns();
    });

    // Handle item selection
    dropdownItems.forEach((item) => {
      item.addEventListener("click", function (e) {
        e.stopPropagation();

        // Store current values from the button
        const currentImg = valueSelect.querySelector("img").src;
        const currentText = valueSelect.querySelector("span").textContent;
        const currentHtml = valueSelect.innerHTML;

        // Store clicked item values
        const clickedHtml = item.innerHTML;

        // Update the button with clicked item values
        valueSelect.innerHTML = clickedHtml;

        // Update the clicked item with the previous button values
        item.innerHTML = `<img src="${currentImg}" alt="" /><span>${currentText}</span>`;

        closeAllDropdowns();
      });
    });

    // Close dropdown on scroll
    window.addEventListener("scroll", function () {
      closeAllDropdowns();
    });
  });

  function closeAllDropdowns(exception) {
    dropdowns.forEach((dropdown) => {
      const menu = dropdown.querySelector(".dropdown-custom-menu");
      const btn = dropdown.querySelector(".dropdown-custom-btn");

      if (!exception || dropdown !== exception) {
        menu.classList.remove("dropdown--active");
        btn.classList.remove("--active");
      }
    });
  }
}
// end dropdown
// booking
function bookingForm() {
  if (!document.querySelector(".banner-booking")) return;

  var lightPick = new Lightpick({
    field: document.getElementById("check-in"),
    secondField: document.getElementById("check-out"),
    singleDate: false,
    minDate: moment().startOf("now"),
    numberOfMonths: 2,
    onOpen: function () {
      var input = lightPick._opts.field;
      var rect = input.getBoundingClientRect();
      var calendar = lightPick.el;
      if (rect.top >= window.innerHeight / 2) {
        calendar.style.top =
          rect.top + window.scrollY - calendar.offsetHeight + "px";
        calendar.style.left = rect.left + window.scrollX + "px";
      } else {
        calendar.style.top = rect.bottom + window.scrollY + "px";
        calendar.style.left = rect.left + window.scrollX + "px";
      }
    },
  });

  // Counter functionality
  document.querySelectorAll(".people, .child").forEach((section) => {
    const minus = section.querySelector(".min");
    const plus = section.querySelector(".plus");
    const val = section.querySelector(".val");

    plus.onclick = () => {
      const current = parseInt(val.textContent);
      val.textContent = Math.min(current + 1, 10);
      minus.style.opacity = val.textContent > 0 ? "1" : "0.5";
    };

    minus.onclick = () => {
      const current = parseInt(val.textContent);
      const newVal = Math.max(current - 1, 0);
      val.textContent = newVal;
      minus.style.opacity = newVal > 0 ? "1" : "0.5";
    };
  });
}
// end booking

function sectionAccommodation() {
  if ($("section.accommodation").length < 1) return;

  $("section.accommodation").each(function () {
    const $section = $(this);
    const $slider = $section.find(".accommodation-slider__main");
    const $pagination = $section.find(".swiper-pagination");
    const $prev = $section.find(".swiper-button-prev");
    const $next = $section.find(".swiper-button-next");

    const isOffer = $slider.hasClass("offer-slider");

    let slidePerView = $(window).width() > 767 ? (isOffer ? 2.5 : 3.3) : 1.2;

    new Swiper($slider[0], {
      spaceBetween: 40,
      slidesPerView: slidePerView,
      speed: 1000,
      slidesOffsetAfter: 80,
      pagination: {
        el: $pagination[0],
        type: "progressbar",
      },
      navigation: {
        prevEl: $prev[0],
        nextEl: $next[0],
      },
    });
  });
}
function swiperFacility() {
  document.querySelectorAll(".swiper-facility").forEach((el) => {
    let hideTimeout;
    const defaultDuration = 3000; // Thời gian autoplay cố định (1000ms)

    // Hàm cập nhật progress bar
    function updateProgressBars(swiper) {
      var bullets = swiper.pagination.bullets;
      bullets.forEach((bullet, index) => {
        let progressBar = bullet.querySelector(".progress-bar");
        if (index < swiper.realIndex) {
          // Bullet của slide đã xem trước đó
          bullet.classList.add("viewed");
          progressBar.style.width = "100%";
          progressBar.style.transition = "none";
        } else if (index === swiper.realIndex) {
          // Bullet của slide hiện tại: chạy progress bar từ 0% đến 100%
          progressBar.style.width = "0%";
          progressBar.style.transition = "none";
          setTimeout(() => {
            progressBar.style.width = "100%";
            progressBar.style.transition = `width ${swiper.params.autoplay.delay}ms linear`;
          }, 10);
        } else {
          // Bullet của slide chưa xem
          bullet.classList.remove("viewed");
          progressBar.style.width = "0%";
          progressBar.style.transition = "none";
        }
      });
    }
    const swiper = new Swiper(el, {
      slidesPerView: 1,
      watchSlidesProgress: true,
      speed: 1500,
      loop: true,
      autoplay: {
        delay: 3000,
      },
      pagination: {
        el: el.querySelector(".swiper-pagination"),
        clickable: true,
        renderBullet: function (index, className) {
          return `
            <button class="${className}">
              <span class="progress-bar"></span>
            </button>`;
        },
      },
      on: {
        init(swiper) {
          swiper.slides.forEach((slide) => {
            const caption = slide.querySelector(".caption");
            if (caption) {
              caption.style.opacity = "0";
              caption.style.transition = "opacity 0.6s ease";
            }
          });

          const activeCaption =
            swiper.slides[swiper.activeIndex]?.querySelector(".caption");
          if (activeCaption) {
            activeCaption.style.opacity = "1";
            hideTimeout = setTimeout(() => {
              activeCaption.style.opacity = "0";
            }, 2200);
          }
        },

        slideChangeTransitionStart(swiper) {
          swiper.params.autoplay.delay = defaultDuration; // Đặt lại delay
          swiper.autoplay.start();
          swiper.slides.forEach((slide) => {
            const caption = slide.querySelector(".caption");
            if (caption) {
              caption.style.opacity = "0";
            }
          });

          clearTimeout(hideTimeout);
        },

        slideChangeTransitionEnd(swiper) {
          updateProgressBars(swiper);
          const activeCaption =
            swiper.slides[swiper.activeIndex]?.querySelector(".caption");
          if (activeCaption) {
            activeCaption.style.opacity = "1";
            hideTimeout = setTimeout(() => {
              activeCaption.style.opacity = "0";
            }, 2200);
          }
        },

        progress(swiper) {
          swiper.slides.forEach((slide) => {
            const slideProgress = slide.progress || 0;
            const innerOffset = swiper.width * 0.9;
            const innerTranslate = slideProgress * innerOffset;

            const slideInner = slide.querySelector(".box-img");
            if (slideInner && !isNaN(innerTranslate)) {
              slideInner.style.transform = `translate3d(${innerTranslate}px, 0, 0)`;
            }
          });
        },

        touchStart(swiper) {
          swiper.slides.forEach((slide) => {
            slide.style.transition = "";
          });
          clearTimeout(hideTimeout);
        },

        setTransition(swiper, speed) {
          const easing = "cubic-bezier(0.25, 0.1, 0.25, 1)";
          swiper.slides.forEach((slide) => {
            slide.style.transition = `${speed}ms ${easing}`;
            const slideInner = slide.querySelector(".box-img");
            if (slideInner) {
              slideInner.style.transition = `${speed}ms ${easing}`;
            }
          });
        },
      },
    });
  });
}

function swiperAccommodation() {
  const $sliders = $(".swiper-accomodation");

  if ($sliders.length < 1) return;

  // Iterate through each accommodation-detail section
  $(".accommodation-detail").each(function () {
    const $section = $(this);
    const $slider = $section.find(".swiper-accomodation");

    const $pagination = $slider
      .closest(".detail-gallery")
      .find(".swiper-pagination");
    const $prev = $slider
      .closest(".detail-gallery")
      .find(".swiper-button-prev");
    const $next = $slider
      .closest(".detail-gallery")
      .find(".swiper-button-next");

    const sliderPerView = $(window).width() < 992 ? 1 : 2.5;

    // Initialize the main slider
    const swiperMain = new Swiper($slider[0], {
      slidesPerView: sliderPerView,
      spaceBetween: 24,
      slidesOffsetAfter: 0,
      speed: 1000,
      parallax: true,
      pagination: {
        el: $pagination[0],
        type: "progressbar",
      },
      navigation: {
        prevEl: $prev[0],
        nextEl: $next[0],
      },
    });

    // Handle modal gallery slider
    const modalId = $slider.find(".swiper-slide").first().data("bs-target"); // e.g., "#modalGallery-1"
    const $modal = $(modalId);

    if ($modal.length) {
      let swiperGallery = null;
      let syncing = false;

      $slider.find(".swiper-slide").on("click", function () {
        const slideIndex = $(this).index();
        $modal.modal("show");
      });

      const $gallery = $modal.find(".swiper-accomodation-gallery");
      const $paginationG = $modal.find(".swiper-pagination");
      const $prevG = $modal.find(".swiper-button-prev");
      const $nextG = $modal.find(".swiper-button-next");

      // Initialize swiperGallery when modal opens for the first time
      const sliderPerViewGallery = $(window).width() < 992 ? 1 : "auto";
      swiperGallery = new Swiper($gallery[0], {
        slidesPerView: sliderPerViewGallery,
        slidesOffsetAfter: 0,
        spaceBetween: 24,
        speed: 1000,
        parallax: true,
        // centeredSlides: true,
        pagination: {
          el: $paginationG[0],
          type: "progressbar",
        },
        navigation: {
          prevEl: $prevG[0],
          nextEl: $nextG[0],
        },
        breakpoints: {
          991: {
            spaceBetween: 40,
            slidesPerView: "auto",
          },
        },
        on: {
          slideChange: function () {
            if (syncing) return;
            syncing = true;
            swiperMain.slideTo(swiperGallery.activeIndex, 0); // Sync main slider
            syncing = false;
          },
          init: function () {
            // Reveal Swiper after initialization
            $gallery.removeClass("swiper-hidden").addClass("swiper-visible");
          },
        },
      });
    }
  });
}

function ctaMess() {
  ScrollTrigger.create({
    start: "top top",
    end: 99999,
    paused: true,
    onUpdate: (self) => {
      self.direction === 1
        ? $("#cta-mess").addClass("hide")
        : $("#cta-mess").removeClass("hide");
    },
  });
}
function distortionImg() {
  document.querySelectorAll(".distortion-img").forEach((wrapper) => {
    const imgElement = wrapper.querySelector("img");

    if (imgElement) {
      const imageSrc = imgElement.src;

      imgElement.style.display = "none";

      new hoverEffect({
        parent: wrapper,
        intensity: 0.1,
        angle: 0,
        image1: imageSrc,
        image2: imageSrc,
        displacementImage: "./assets/images/distortion/ripple.jpg",
      });
    }
  });
}
function loadingBanner() {
  let classesRemoved = false;
  if ($(".banner-hero-clip").length < 1) return;

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: ".banner-hero-clip",
      start: "top top",
      scrub: true,
      pin: true,
      once: true,

      onUpdate: (self) => {
        if (self.progress === 1 && !classesRemoved) {
          document
            .querySelector(".banner-hero-clip")
            ?.classList.remove("banner-hero-clip");
          document
            .querySelectorAll(".anim-clip-circle")
            .forEach((el) => el.classList.remove("anim-clip-circle"));
          document.querySelector(".banner-title").classList.add("d-none");
          document.getElementById("header").classList.remove("hide-header");
          classesRemoved = true;
          ScrollTrigger.refresh();

          lenis.scrollTo(0, { immediate: true });
        }
      },

      onLeave: (self) => {
        // Hiển thị các phần UI (nếu có)
        if ($("#cta-mess").length) $("#cta-mess").removeClass("hide");
        if ($(".banner-booking").length)
          $(".banner-booking").removeClass("hide");

        // Reset scroll trigger và cuộn về vị trí bắt đầu (top trang)
        const start = self.start;

        self.scroll(self.start); // Thiết lập scroll trigger về vị trí bắt đầu
        self.disable(); // Tắt trigger animation để không chạy lại
        self.animation.progress(1); // Đảm bảo animation chạy đến cuối
        ScrollTrigger.refresh(); // Update lại ScrollTrigger

        window.scrollTo({ top: 0, behavior: "smooth" }); // Cuộn về đầu trang
      },
    },
  });

  tl.to(".anim-clip-circle", {
    clipPath: "circle(70.7% at 50% 50%)",
  }).to(
    ".banner-container img",
    {
      scale: 1,
    },
    0
  );
}

function filterGalleryMobile() {
  const filterContainer = document.querySelector(".filter-mobile");
  if (!filterContainer) return;

  const filterValue = filterContainer.querySelector(".filter-value-select");
  const filterHead = filterContainer.querySelector(".filter-head");
  const filterBody = filterContainer.querySelector(".filter-body");
  const filterButtons = filterBody.querySelectorAll(".nav-link");

  if (!filterValue || !filterHead || !filterBody || filterButtons.length === 0)
    return;

  // Toggle filter list visibility
  filterValue.addEventListener("click", () => {
    filterHead.classList.toggle("active");
    filterBody.classList.toggle("active");
  });

  // Handle option click
  filterButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const titleEl = btn.querySelector(".title-tab");
      console.log(titleEl);

      if (!titleEl) return;

      const selectedText = titleEl.textContent.trim();
      filterValue.textContent = selectedText;

      // Close dropdown
      filterHead.classList.remove("active");
      filterBody.classList.remove("active");
    });
  });
}

function header() {
  // toggle active icon menu
  const hamburger = document.getElementById("hamburger");
  const subMenu = document.getElementById("header-sub-menu");

  hamburger.addEventListener("click", function () {
    this.classList.toggle("active");
    subMenu.classList.toggle("active");
  });
}
const init = () => {
  gsap.registerPlugin(ScrollTrigger);
  customDropdown();
  bookingForm();
  sectionAccommodation();
  swiperFacility();
  ctaMess();
  distortionImg();
  swiperAccommodation();
  loadingBanner();
  filterGalleryMobile();
  header();
};
preloadImages("img").then(() => {
  // Once images are preloaded, remove the 'loading' indicator/class from the body

  init();
});

let isLinkClicked = false;
$("a").on("click", function (e) {
  if (this.href && !this.href.match(/^#/) && !this.href.match(/^javascript:/)) {
    isLinkClicked = true;
  }
});

$(window).on("beforeunload", function () {
  if (!isLinkClicked) {
    $(window).scrollTop(0);
  }
  isLinkClicked = false;
});
