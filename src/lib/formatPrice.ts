/**
 * Formats a price value in Indian Rupees with proper formatting
 * @param price - The price value to format
 * @returns Formatted price string with ₹ symbol
 */
export function formatPrice(price: number): string {
  // For values above 1 crore
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)}Cr`;
  }
  // For values above 1 lakh
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)}L`;
  }
  // For smaller values, use standard Indian number formatting
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(price);
}