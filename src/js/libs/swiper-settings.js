/* Swiper settings */
export function initSwiper() {
  if (typeof Swiper === 'undefined') return;

  const basicSwiper = new Swiper('.basic-slider', {
    navigation: {
      nextEl: '.swiper-button-next',
      prevEl: '.swiper-button-prev',
    },
    pagination: {
      el: '.swiper-pagination',
      clickable: true,
    },
    parallax: true,
    slidesPerView: 'auto',
    centeredSlides: true,
    allowTouchMove: true,
    grabCursor: true,
    spaceBetween: 20,
    breakpoints: {
      1200: {
        spaceBetween: 40,
      },
    },
  });
}
