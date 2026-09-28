/* ==========================================================================
   TRADITIONAL VIETNAMESE POTTERY PRESENTATION - JAVASCRIPT
   Features: Slide Navigation, Ember Particle Physics, Touch Gestures, Autoplay
   ========================================================================== */

document.addEventListener("DOMContentLoaded", () => {
  // Application State
  let currentSlide = 1;
  const totalSlides = document.querySelectorAll(".slide").length;
  let autoplayInterval = null;
  let isAutoplay = false;

  // DOM Element References
  const slides = document.querySelectorAll(".slide");
  const currentSlideNumEl = document.getElementById("currentSlideNum");
  const totalSlideNumEl = document.getElementById("totalSlideNum");
  const progressBar = document.getElementById("progressBar");
  const dotsContainer = document.getElementById("dotsContainer");
  const gridModal = document.getElementById("gridModal");
  const gridThumbs = document.getElementById("gridThumbs");
  const autoPlayBtn = document.getElementById("autoPlayBtn");
  const playIcon = document.getElementById("playIcon");

  // Initialize
  initPresentation();

  function initPresentation() {
    totalSlideNumEl.textContent = String(totalSlides).padStart(2, "0");
    createDots();
    createGridThumbs();
    updateSlideView();
    initCanvasEmbers();
    setupEventListeners();
  }

  // Create Pagination Dots
  function createDots() {
    dotsContainer.innerHTML = "";
    for (let i = 1; i <= totalSlides; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 1) dot.classList.add("active");
      dot.addEventListener("click", () => goToSlide(i));
      dotsContainer.appendChild(dot);
    }
  }

  // Create Grid Modal Thumbnails
  function createGridThumbs() {
    gridThumbs.innerHTML = "";
    slides.forEach((slide, index) => {
      const slideNum = index + 1;
      const title = slide.querySelector("h2, .hero-title").textContent;

      const thumb = document.createElement("div");
      thumb.className = `thumb-card ${slideNum === currentSlide ? "active" : ""}`;
      thumb.innerHTML = `
        <span>Slide ${String(slideNum).padStart(2, "0")}</span>
        <h4>${title}</h4>
      `;
      thumb.addEventListener("click", () => {
        goToSlide(slideNum);
        toggleGridModal(false);
      });
      gridThumbs.appendChild(thumb);
    });
  }

  // Core Navigation Functions
  window.goToSlide = function (slideIndex) {
    if (slideIndex < 1 || slideIndex > totalSlides) return;
    currentSlide = slideIndex;
    updateSlideView();
  };

  window.nextSlide = function () {
    if (currentSlide < totalSlides) {
      currentSlide++;
    } else {
      currentSlide = 1; // Loop back
    }
    updateSlideView();
  };

  window.prevSlide = function () {
    if (currentSlide > 1) {
      currentSlide--;
      updateSlideView();
    }
  };

  // Update UI Elements
  function updateSlideView() {
    // Active slide class
    slides.forEach((slide, idx) => {
      slide.classList.toggle("active", idx + 1 === currentSlide);
    });

    // Slide Counter
    currentSlideNumEl.textContent = String(currentSlide).padStart(2, "0");

    // Progress Bar
    const progressPercent = (currentSlide / totalSlides) * 100;
    progressBar.style.width = `${progressPercent}%`;

    // Dots
    const dots = dotsContainer.querySelectorAll(".dot");
    dots.forEach((dot, idx) => {
      dot.classList.toggle("active", idx + 1 === currentSlide);
    });

    // Thumbnails
    const thumbs = gridThumbs.querySelectorAll(".thumb-card");
    thumbs.forEach((thumb, idx) => {
      thumb.classList.toggle("active", idx + 1 === currentSlide);
    });
  }

  // Grid Modal Toggle
  function toggleGridModal(show) {
    gridModal.classList.toggle("show", show);
  }

  // Autoplay Functionality
  function toggleAutoplay() {
    isAutoplay = !isAutoplay;
    if (isAutoplay) {
      playIcon.className = "fa-solid fa-pause";
      autoPlayBtn.style.background = "var(--terracotta-primary)";
      autoplayInterval = setInterval(() => {
        nextSlide();
      }, 5000);
    } else {
      playIcon.className = "fa-solid fa-play";
      autoPlayBtn.style.background = "";
      clearInterval(autoplayInterval);
    }
  }

  // Keyboard Navigation & Touch Swipe Events
  function setupEventListeners() {
    // Keyboard Shortcuts
    document.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        nextSlide();
      } else if (e.key === "ArrowLeft") {
        prevSlide();
      } else if (e.key.toLowerCase() === "g") {
        toggleGridModal(!gridModal.classList.contains("show"));
      } else if (e.key === "Escape") {
        toggleGridModal(false);
      }
    });

    // Modal Control Events
    document
      .getElementById("gridBtn")
      .addEventListener("click", () => toggleGridModal(true));
    document
      .getElementById("closeGridBtn")
      .addEventListener("click", () => toggleGridModal(false));
    autoPlayBtn.addEventListener("click", toggleAutoplay);

    // Touch Swipe Support for Mobile
    let touchStartX = 0;
    let touchEndX = 0;

    const slidesContainer = document.getElementById("slidesContainer");
    slidesContainer.addEventListener(
      "touchstart",
      (e) => {
        touchStartX = e.changedTouches[0].screenX;
      },
      false,
    );

    slidesContainer.addEventListener(
      "touchend",
      (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
      },
      false,
    );

    function handleSwipe() {
      const swipeThreshold = 50;
      if (touchEndX < touchStartX - swipeThreshold) {
        nextSlide(); // Swipe left -> Next
      }
      if (touchEndX > touchStartX + swipeThreshold) {
        prevSlide(); // Swipe right -> Prev
      }
    }
  }

  // Particle Ember Background Effect
  function initCanvasEmbers() {
    const canvas = document.getElementById("emberCanvas");
    const ctx = canvas.getContext("2d");

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    window.addEventListener("resize", () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 40;

    class Ember {
      constructor() {
        this.reset();
      }

      reset() {
        this.x = Math.random() * width;
        this.y = height + Math.random() * 100;
        this.size = Math.random() * 3 + 1;
        this.speedY = Math.random() * 1 + 0.3;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.opacity = Math.random() * 0.6 + 0.2;
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        if (this.y < -10) this.reset();
      }

      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(224, 90, 54, ${this.opacity})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = "#e05a36";
        ctx.fill();
      }
    }

    for (let i = 0; i < particleCount; i++) {
      particles.push(new Ember());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }

    animate();
  }
});
