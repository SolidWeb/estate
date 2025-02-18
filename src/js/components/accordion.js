const accordions = document.querySelectorAll('.accordion');
const accordionsMobile = document.querySelectorAll('.accordion--mobile');
const mqMobileAccordion = window.matchMedia('(max-width: 959.98px)');

export default function accordion() {
  accordions.forEach((accordion) => {
    const buttons = accordion.querySelectorAll('.accordion-button');
    buttons.forEach((button) => {
      const isExpanded = button.getAttribute('aria-expanded');
      isExpanded || button.setAttribute('aria-expanded', 'false');
      button.tagName === 'A' && button.setAttribute('role', 'button');
      button.addEventListener('click', toggleAccordion);
    });
  });

  if (!mqMobileAccordion.matches) {
    accordionsMobile.forEach((accordion) => {
      const buttons = accordion.querySelectorAll('.accordion-button');
      buttons.forEach((button) => {
        // button.removeAttribute('aria-expanded');
        button.tagName === 'A' && button.removeAttribute('role');
        button.removeEventListener('click', toggleAccordion);
      });
    });
  }
}

function toggleAccordion(e) {
  if (e.target.closest('.accordion-button-controls')) return;
  e.preventDefault();

  const accordion = this.closest('.accordion');
  const accordionMultiExpand = accordion.classList.contains('accordion--multi');
  const isExpanded = this.getAttribute('aria-expanded');

  if (!accordionMultiExpand) {
    const accordionButtons = accordion.querySelectorAll('.accordion-button');
    for (let i = 0; i < accordionButtons.length; i++) {
      accordionButtons[i].setAttribute('aria-expanded', 'false');
    }
  }

  if (isExpanded === 'false') {
    this.setAttribute('aria-expanded', 'true');
  }

  if (isExpanded === 'true') {
    this.setAttribute('aria-expanded', 'false');
  }
}
