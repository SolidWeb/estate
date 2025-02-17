/* Just validate settings */
export function initJustValidate() {
  if (typeof JustValidate === 'undefined') return;

  const forms = document.querySelectorAll('.form');

  forms.forEach((form) => {
    const validator = new JustValidate(form, {
      errorLabelStyle: {
        // Remove default styling
        color: false,
      },
      errorFieldCssClass: 'error-field',
      errorLabelCssClass: 'error-label',
    });

    const textFields = form.querySelectorAll('.input-text[required]');

    textFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        /* {
          rule: 'customRegexp',
          errorMessage: 'Некорректный формат ввода',
          // Latin & russian letters, numbers, space, hyphen
          value: /^[A-Za-z0-9А-Яа-яЁё\s\-]+$/gi,
        }, */
        {
          rule: 'minLength',
          errorMessage: 'Минимум 2 символа',
          value: 2,
        },
        {
          rule: 'maxLength',
          errorMessage: 'Максимум 30 символов',
          value: 30,
        },
      ]);
    });

    const textareaFields = form.querySelectorAll('.input-textarea[required]');

    textareaFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        /* {
          rule: 'customRegexp',
          errorMessage: 'Некорректный формат ввода',
          // Latin & russian letters, numbers, space,
          // general punctuation marks, quotes
          value: /^[A-Za-z0-9А-Яа-яЁё\s\-_.,!?;:'"«»“”‘’()]+$/gi,
        }, */
        {
          rule: 'minLength',
          errorMessage: 'Минимум 5 символов',
          value: 5,
        },
        {
          rule: 'maxLength',
          errorMessage: 'Максимум 2000 символов',
          value: 2000,
        },
      ]);
    });

    const emailFields = form.querySelectorAll('.input-email[required]');

    emailFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        {
          rule: 'email',
          errorMessage: 'Некорректный формат e-mail',
        },
      ]);
    });

    const phoneFields = form.querySelectorAll('.input-tel[required]');

    phoneFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        {
          rule: 'customRegexp',
          errorMessage: 'Некорректный формат номера',
          // Russian phone number formats + simple 7 digit format
          value:
            /^(?:\+?7|8)?[\s-]?(?:\(?(?:9\d{2}|4[6-9]\d|5\d{2}|3[0-8]\d|82\d|8[1-9][0-9])\)?[\s-]?\d{3}[\s-]?\d{2}[\s-]?\d{2}|\d{3}[\s-]?\d{2}[\s-]?\d{2})$/gi,
        },
      ]);
    });

    const passwordFields = form.querySelectorAll('.input-password[required]');

    passwordFields.forEach((field) => {
      validator.addField(field, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
        {
          rule: 'minLength',
          errorMessage: 'Минимум 8 символов',
          value: 8,
        },
      ]);
    });

    const checkboxes = form.querySelectorAll('.input-checkbox[required]');

    checkboxes.forEach((checkbox) => {
      validator.addField(checkbox, [
        {
          rule: 'required',
          errorMessage: 'Это обязательноe поле',
        },
      ]);
    });

    const radioGroups = form.querySelectorAll('.radio-fieldset--required');

    radioGroups.forEach((radioGroup) => {
      validator.addRequiredGroup(radioGroup, 'Выберите одну из опций');
    });

    const selects = form.querySelectorAll('select[required]');

    selects.forEach((select) => {
      validator.addField(select, [
        {
          rule: 'required',
          errorMessage: 'Выберите одну из опций',
        },
      ]);
    });

    validator.onSuccess((e) => {
      /* Redirect to the success page upon successful form submission */
      // const rootLocation = 'https://domen.name';
      // const successPage = 'success.html';
      // window.location.href = rootLocation + successPage;
      /* Complete form submission template */
      // const xhr = new XMLHttpRequest();
      // const formData = new FormData(form);
      // xhr.open('POST', form.getAttribute('action'));
      // xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      // xhr.send(formData);
      // xhr.onreadystatechange = function () {
      //   const statusDialogSuccess = document.querySelector(
      //     '.dialog[data-name="success"]'
      //   );
      //   // Form send successfully
      //   if (this.readyState === 4 && this.status === 200) {
      //     statusDialogSuccess.showModal();
      //   }
      // };
      // xhr.onerror = function () {
      //   // error
      // };
    });
  });
}
