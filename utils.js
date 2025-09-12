// This file contains globally shared helper functions
// to be used by any module in the application.

/**
 * Converts a number to a formatted Indian Rupee currency string.
 * @param {number} v The number to format.
 * @param {number} d The number of decimal places.
 * @returns {string} Formatted currency string (e.g., "₹1,234.56").
 */
function inr(v, d) {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: d,
      maximumFractionDigits: d,
    }).format(n(v));
  } catch (e) {
    return "₹" + n(v).toFixed(d);
  }
}

/**
 * Safely converts a value to a number, returning 0 if it's not a valid number.
 * @param {*} v The value to convert.
 * @returns {number} The converted number or 0.
 */
function n(v) {
  const t = Number(v);
  return isFinite(t) ? t : 0;
}
