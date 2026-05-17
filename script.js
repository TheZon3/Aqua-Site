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
