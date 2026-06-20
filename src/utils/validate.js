/**
 * 判断是否为外部链接
 * @param {string} path - 路径
 * @returns {boolean} 是否为外部链接
 */
export function isExternal(path) {
  return /^(https?:|mailto:|tel:)/.test(path);
}

/**
 * 判断是否为URL
 * @param {string} path - 路径
 * @returns {boolean} 是否为URL
 */
export function isURL(path) {
  const urlPattern = /^https?:\/\/.+/;
  return urlPattern.test(path);
}

/**
 * 判断是否为邮箱
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否为邮箱
 */
export function isEmail(email) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(email);
}

/**
 * 判断是否为手机号
 * @param {string} phone - 手机号
 * @returns {boolean} 是否为手机号
 */
export function isPhone(phone) {
  const phonePattern = /^1[3-9]\d{9}$/;
  return phonePattern.test(phone);
}

/**
 * 判断是否为身份证号
 * @param {string} idCard - 身份证号
 * @returns {boolean} 是否为身份证号
 */
export function isIdCard(idCard) {
  const idCardPattern = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
  return idCardPattern.test(idCard);
}

/**
 * 判断是否为数字
 * @param {string|number} value - 值
 * @returns {boolean} 是否为数字
 */
export function isNumber(value) {
  const numberPattern = /^-?\d+(\.\d+)?$/;
  return numberPattern.test(value.toString());
}

/**
 * 判断是否为整数
 * @param {string|number} value - 值
 * @returns {boolean} 是否为整数
 */
export function isInteger(value) {
  const integerPattern = /^-?\d+$/;
  return integerPattern.test(value.toString());
}

/**
 * 判断是否为正整数
 * @param {string|number} value - 值
 * @returns {boolean} 是否为正整数
 */
export function isPositiveInteger(value) {
  const positiveIntegerPattern = /^\d+$/;
  return positiveIntegerPattern.test(value.toString());
}

/**
 * 判断是否为JSON字符串
 * @param {string} str - 字符串
 * @returns {boolean} 是否为JSON字符串
 */
export function isJSON(str) {
  try {
    JSON.parse(str);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * 判断是否为日期字符串
 * @param {string} date - 日期字符串
 * @returns {boolean} 是否为日期字符串
 */
export function isDate(date) {
  const dateObj = new Date(date);
  return dateObj instanceof Date && !isNaN(dateObj);
}

/**
 * 判断是否为空
 * @param {any} value - 值
 * @returns {boolean} 是否为空
 */
export function isEmpty(value) {
  if (value === null || value === undefined) {
    return true;
  }
  if (typeof value === 'string' && value.trim() === '') {
    return true;
  }
  if (Array.isArray(value) && value.length === 0) {
    return true;
  }
  if (typeof value === 'object' && Object.keys(value).length === 0) {
    return true;
  }
  return false;
}

/**
 * 判断是否为数组
 * @param {any} value - 值
 * @returns {boolean} 是否为数组
 */
export function isArray(value) {
  return Array.isArray(value);
}

/**
 * 判断是否为对象
 * @param {any} value - 值
 * @returns {boolean} 是否为对象
 */
export function isObject(value) {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

/**
 * 判断是否为函数
 * @param {any} value - 值
 * @returns {boolean} 是否为函数
 */
export function isFunction(value) {
  return typeof value === 'function';
}

/**
 * 判断是否为字符串
 * @param {any} value - 值
 * @returns {boolean} 是否为字符串
 */
export function isString(value) {
  return typeof value === 'string';
}

/**
 * 判断是否为布尔值
 * @param {any} value - 值
 * @returns {boolean} 是否为布尔值
 */
export function isBoolean(value) {
  return typeof value === 'boolean';
}

/**
 * 判断是否为Symbol
 * @param {any} value - 值
 * @returns {boolean} 是否为Symbol
 */
export function isSymbol(value) {
  return typeof value === 'symbol';
}

/**
 * 判断是否为undefined
 * @param {any} value - 值
 * @returns {boolean} 是否为undefined
 */
export function isUndefined(value) {
  return value === undefined;
}

/**
 * 判断是否为null
 * @param {any} value - 值
 * @returns {boolean} 是否为null
 */
export function isNull(value) {
  return value === null;
}