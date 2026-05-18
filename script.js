const slides = document.querySelectorAll('.slide');
const controls = document.querySelectorAll('.control');
const navToggle = document.getElementById('navToggle');
const siteNav = document.getElementById('siteNav');
let currentIndex = 0;
let carouselInterval;

// Apply `data-bg` values to slides so user can supply image paths in HTML
function applySlideBackgrounds() {
  slides.forEach(slide => {
    const bg = slide.dataset.bg;
    if (bg) {
      slide.style.backgroundImage = `url('${bg}')`;
      slide.style.backgroundRepeat = 'no-repeat';
      slide.style.backgroundPosition = 'center';
      slide.style.backgroundSize = 'cover';
    }
  });
}

function showSlide(index) {
  slides.forEach((slide, idx) => {
    slide.classList.toggle('active', idx === index);
  });
  controls.forEach((button, idx) => {
    button.classList.toggle('active', idx === index);
  });
  currentIndex = index;
}

function startCarousel() {
  carouselInterval = setInterval(() => {
    const nextIndex = (currentIndex + 1) % slides.length;
    showSlide(nextIndex);
  }, 5500);
}

controls.forEach(button => {
  button.addEventListener('click', () => {
    clearInterval(carouselInterval);
    showSlide(Number(button.dataset.slide));
    startCarousel();
  });
});

navToggle.addEventListener('click', () => {
  const opened = siteNav.classList.toggle('open');
  navToggle.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', opened ? 'true' : 'false');
  document.body.classList.toggle('nav-open', opened);
  if (opened) {
    clearInterval(carouselInterval);
  } else {
    startCarousel();
  }
});

// Close mobile nav when a link is clicked
siteNav.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    siteNav.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('nav-open');
  });
});

// initialize backgrounds first so slides render correctly
applySlideBackgrounds();
showSlide(0);
startCarousel();

// --- Mobile touch / swipe handlers for header carousel ---
const headerCarousel = document.getElementById('headerCarousel');
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;
const SWIPE_THRESHOLD = 50; // px - minimum horizontal movement to count as a swipe

function onTouchStart(e) {
  if (!e.touches || e.touches.length !== 1) return;
  touchStartX = e.touches[0].clientX;
  touchStartY = e.touches[0].clientY;
  touchEndX = touchStartX;
  touchEndY = touchStartY;
  // pause carousel while user interacts
  clearInterval(carouselInterval);
}

function onTouchMove(e) {
  if (!e.touches || e.touches.length !== 1) return;
  touchEndX = e.touches[0].clientX;
  touchEndY = e.touches[0].clientY;
  const dx = Math.abs(touchEndX - touchStartX);
  const dy = Math.abs(touchEndY - touchStartY);
  // If the user is primarily swiping horizontally, prevent vertical scroll from hijacking
  if (dx > dy && dx > 10) {
    e.preventDefault();
  }
}

function onTouchEnd() {
  const dx = touchEndX - touchStartX;
  const dy = touchEndY - touchStartY;
  // Only treat as swipe if horizontal movement is dominant and exceeds threshold
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > SWIPE_THRESHOLD) {
    if (dx < 0) {
      // swipe left -> next
      const nextIndex = (currentIndex + 1) % slides.length;
      showSlide(nextIndex);
    } else {
      // swipe right -> previous
      const prevIndex = (currentIndex - 1 + slides.length) % slides.length;
      showSlide(prevIndex);
    }
  }
  // resume carousel after interaction
  startCarousel();
}

if (headerCarousel) {
  headerCarousel.addEventListener('touchstart', onTouchStart, { passive: true });
  headerCarousel.addEventListener('touchmove', onTouchMove, { passive: false });
  headerCarousel.addEventListener('touchend', onTouchEnd);
  headerCarousel.addEventListener('touchcancel', onTouchEnd);
}
