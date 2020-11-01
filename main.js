const Validator = (options) => {
  const selectorRules = {};
  //function process validate
  const validate = (inputEl, rule) => {
    let errorMessage;
    const errEl = inputEl
      .closest(options.formGoupSelector)
      .querySelector(options.errorSelector);

    const rules = selectorRules[rule.selector];

    for (let i = 0; i < rules.length; i++) {
      errorMessage = rules[i](inputEl.value);
      if (errorMessage) break;
    }

    if (errorMessage) {
      errEl.innerText = errorMessage;
      inputEl.closest(options.formGoupSelector).classList.add("invalid");
    } else {
      errEl.innerText = "";
      inputEl.closest(options.formGoupSelector).classList.remove("invalid");
    }
    return !errorMessage;
  };

  const formEl = document.querySelector(options.form);
  if (formEl) {
    formEl.onsubmit = (e) => {
      e.preventDefault();

      let isSuccess = true;

      options.rules.forEach((rule) => {
        const inputEl = formEl.querySelector(rule.selector);
        const isValid = validate(inputEl, rule);
        if (!isValid) {
          isSuccess = false;
        }
      });

      if (isSuccess) {
        const enableInput = formEl.querySelectorAll("[name]:not([disable])");

        const formValue = Array.from(enableInput).reduce((values, input) => {
          values[input.name] = input.value;
          return values;
        }, {});

        if (typeof options.onSubmit === "function") {
          options.onSubmit(formValue);
        }
      } else {
        console.log("co loi");
      }
    };
  }

  if (formEl) {
    options.rules.forEach((rule) => {
      //save the rules for each input

      if (Array.isArray(selectorRules[rule.selector])) {
        selectorRules[rule.selector].push(rule.test);
      } else {
        selectorRules[rule.selector] = [rule.test];
      }

      const inputEl = formEl.querySelector(rule.selector);
      const errEl = inputEl
        .closest(options.formGoupSelector)
        .querySelector(options.errorSelector);

      if (inputEl) {
        inputEl.onblur = () => {
          validate(inputEl, rule);
        };

        inputEl.oninput = () => {
          errEl.innerText = "";
          inputEl.closest(options.formGoupSelector).classList.remove("invalid");
        };
      }
    });
  }
};

Validator.isRequired = (selector, message) => {
  return {
    selector,
    test: (value) => {
      return value.trim() ? undefined : message || "Vui lòng nhập tên đầy đủ";
    },
  };
};
Validator.isEmail = (selector, message) => {
  const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return {
    selector,
    test: (value) => {
      return regex.test(value)
        ? undefined
        : message || "Trường này phải là email";
    },
  };
};

Validator.minLength = (selector, min) => {
  return {
    selector,
    test: (value) => {
      return value.length >= min
        ? undefined
        : `Mật khẩu tối thiểu ${min} ký tự`;
    },
  };
};

Validator.isConfirmed = (selector, getConfirmValue, message) => {
  return {
    selector,
    test: (value) => {
      return value === getConfirmValue()
        ? undefined
        : message || "Mật khẩu nhập lại không đúng";
    },
  };
};
