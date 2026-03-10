import "./scripts/init.js";
import "./components.js";

//
//
//
//
// Общие скрипты

//
//
// Слайдеры
document.addEventListener("DOMContentLoaded", () => {
  // Баннеры
  if (document.querySelector("#promo-slider")) {
    new Splide("#promo-slider", {
      autoplay: true,
      type: "loop",
      focus: "center",
      perPage: 1,
      gap: "16px",
      breakpoints: {
        576: {
          gap: "12px",
        },
      },
      speed: 500,
      arrows: false,
      pagination: false,
    }).mount();
  }

  // Галерея
  const aboutSliderEl = document.querySelector("#about-slider");

  if (aboutSliderEl) {
    const aboutSlider = new Splide(aboutSliderEl, {
      type: "slide",
      gap: "16px",
      speed: 500,
      arrows: true,
      pagination: false,
      perPage: 4,
      perMove: 1,
      drag: true,
      snap: true,
      classes: {
        arrows: "splide__arrows",
        arrow: "splide__arrow about__arrow",
        prev: "splide__prev about__prev",
        next: "splide__next about__next",
      },
      breakpoints: {
        1199: {
          perPage: 3,
          perMove: 1,
        },
        767: {
          perPage: 2,
          perMove: 1,
          gap: "12px",
        },
      },
    });

    const progressBar = aboutSliderEl.querySelector(".splide__progress-bar");

    const updateProgress = () => {
      const end = aboutSlider.Components.Controller.getEnd() + 1;
      const rate = Math.min((aboutSlider.index + 1) / end, 1);
      progressBar.style.width = rate * 100 + "%";
    };

    aboutSlider.on("mounted move updated resized", updateProgress);

    aboutSlider.mount();
  }

  // Другие мероприятия
  const otherEvents = document.querySelector("#other-slider");

  if (otherEvents) {
    const otherSlider = new Splide(otherEvents, {
      type: "slide",
      gap: "16px",
      speed: 500,
      arrows: true,
      pagination: false,
      perPage: 4,
      perMove: 1,
      drag: true,
      snap: true,
      classes: {
        arrows: "splide__arrows",
        arrow: "splide__arrow other__arrow",
        prev: "splide__prev other__prev",
        next: "splide__next other__next",
      },
      breakpoints: {
        1199: {
          perPage: 3,
          perMove: 1,
        },
        767: {
          perPage: 2,
          perMove: 1,
          gap: "12px",
        },
        430: {
          perPage: 1,
          perMove: 1,
          gap: "12px",
        },
      },
    });

    const progressBar = otherEvents.querySelector(".splide__progress-bar");

    const updateProgress = () => {
      const end = otherSlider.Components.Controller.getEnd() + 1;
      const rate = Math.min((otherSlider.index + 1) / end, 1);
      progressBar.style.width = rate * 100 + "%";
    };

    otherSlider.on("mounted move updated resized", updateProgress);
    otherSlider.mount();
  }
});

// Куки
document.addEventListener("DOMContentLoaded", function () {
  setTimeout(() => {
    const cookiesBlock = document.querySelector(".cookies");
    const cookiesButton = document.querySelector(".cookies__button");

    if (!localStorage.getItem("cookiesAccepted")) {
      cookiesBlock.classList.add("active");
    }

    cookiesButton.addEventListener("click", function () {
      cookiesBlock.classList.remove("active");
      localStorage.setItem("cookiesAccepted", "true");
    });
  }, 3000);
});
