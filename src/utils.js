// Utility Functions - Updated 2026-06-27

/**
 * Format date to readable string
 * @param {Date} date - Date to format
 * @returns {string} Formatted date
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric', month: 'long', day: 'numeric'
  });
};

/**
 * Capitalize first letter
 * @param {string} str
 */
export const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

/**
 * Debounce function
 */
export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

export const truncate = (str, len = 100) => str.length > len ? str.slice(0, len) + '...' : str;
