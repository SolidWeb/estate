/* iMask settings */
export function initIMask() {
  if (typeof IMask === 'undefined') return;

  const telInputs = document.querySelectorAll('.input-tel');
  const placeholder = '+7 (___) ___-__-__';
  const maskOptions = {
    mask: '+{7} (000) 000-00-00',
    lazy: false,
  };

  telInputs.forEach((input) => {
    input.classList.add('is-masked');
    IMask(input, maskOptions);

    // Simulate the color change behavior of a placeholder text
    const initialValue = placeholder;
    input.addEventListener('input', function () {
      if (input.value !== initialValue) {
        input.classList.add('is-filled');
      } else {
        input.classList.remove('is-filled');
      }
    });
  });
}
