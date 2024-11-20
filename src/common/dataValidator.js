export default class DataValidator {
  static areLetters(string) {
    return /^[A-ZА-Яa-zа-я]+$/.test(string);
  }

  static areDigits(string) {
    return /^[0-9]+$/.test(string);
  }

  static isUpperCase(string) {
    return /^[A-ZА-Я]+$/.test(string);
  }

  static isLowerCase(string) {
    return /^[a-zа-я]+$/.test(string);
  }

  static isCapital(string) {
    if (!string) {
      return false;
    }

    const firstChar = string[0];

    if (string.length === 1) {
      return this.isUpperCase(firstChar);
    }

    const rest = string.substring(1);

    return this.isUpperCase(firstChar) && this.isLowerCase(rest);
  }

  static validateRequired = v => !!v
    || "Поле обязательно для заполнения";

  static validateLength = (v, minLength) => v.length >= minLength
    || `Строка должна быть не короче ${minLength} символов`;

  static validateEmail = v => (/.+@.+\..+/.test(v))
    || "Должен быть корректный e-mail";

  static getStringRules(minLength) {
    return [
      v => this.validateRequired(v),
      v => this.validateLength(v, minLength)
    ];
  }

  static getFirstNameRules() {
    return [
      v => this.validateRequired(v),
      v => this.areLetters(v) || "Имя должно содержать только буквы",
      v => v.length <= 30 || "Имя не должно быть не длиннее 30 символов",
      v => this.isCapital(v) || "Имя должно начинаться с заглавной буквы, и должно содержать одну заглавную букву"
    ];
  }

  static getLastNameRules() {
    return [
      v => this.validateRequired(v),
      v => this.areLetters(v) || "Фамилия должна содержать только буквы",
      v => v.length <= 30 || "Фамилия не должна быть не длиннее 30 символов",
      v => this.isCapital(v) || "Фамилия должна начинаться с заглавной буквы, и должна содержать одну заглавную букву"
    ];
  }

  static getLoginRules() {
    return [
      v => this.validateRequired(v),
      v => v.length >= 2
        || "Логин должен быть не короче 2 символов"
    ];
  }

  static getEmailRules() {
    return [
      v => this.validateRequired(v),
      v => this.validateEmail(v)
    ];
  }

  static getPasswordRules(passwordOptions) {
    const requiredLength = passwordOptions?.requiredLength ?? 0;
    const requireLowercase = passwordOptions?.requireLowercase ?? false;
    const requireUppercase = passwordOptions?.requireUppercase ?? false;
    const requireDigit = passwordOptions?.requireDigit ?? false;

    return [
      v => this.validateRequired(v),
      v => v.length >= requiredLength
        || `Пароль должен быть не короче ${requiredLength} символов`,
      v => !requireLowercase || v.toUpperCase() !== v
        || "Пароль обязательно должен содержать букву в нижнем регистре",
      v => !requireUppercase || v.toLowerCase() !== v
        || "Пароль обязательно должен содержать букву в верхнем регистре",
      v => requireDigit || v.split("").some(c => Number.isInteger(+c))
        || "Пароль обязательно должен содержать цифру"
    ];
  }

  static getPasswordConfirmationRules(otherValue, passwordOptions) {
    return [
      ...this.getPasswordRules(passwordOptions),
      value => otherValue === value || "Пароли должны совпадать"
    ];
  }
}
