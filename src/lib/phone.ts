/**
 * Utility function to normalize phone numbers into standard E.164 format.
 * Prevents identical phone numbers formatted differently (e.g. '9876543210', '+91 9876543210', '09876543210')
 * from creating separate user accounts or failing authentication.
 */
export function normalizePhoneNumber(rawPhone: string, defaultCountryCode: string = '+91'): string {
  if (!rawPhone || typeof rawPhone !== 'string') return '';

  // 1. Remove all whitespace, hyphens, dots, and parentheses
  const cleaned = rawPhone.trim().replace(/[\s\-\(\)\.]/g, '');
  if (!cleaned) return '';

  // 2. If already starts with '+', keep '+' and strip non-digits
  if (cleaned.startsWith('+')) {
    const digitsOnly = cleaned.slice(1).replace(/\D/g, '');
    return '+' + digitsOnly;
  }

  // 3. Extract digits
  let digitsOnly = cleaned.replace(/\D/g, '');
  if (!digitsOnly) return '';

  // 4. Handle leading '00' (international prefix format e.g. 00919876543210)
  if (digitsOnly.startsWith('00')) {
    return '+' + digitsOnly.slice(2);
  }

  // 5. Handle domestic leading '0' (e.g. 09876543210 -> 9876543210)
  if (digitsOnly.length === 11 && digitsOnly.startsWith('0')) {
    digitsOnly = digitsOnly.slice(1);
  }

  // 6. Standard 10-digit mobile number -> add default country code (+91)
  if (digitsOnly.length === 10) {
    return defaultCountryCode + digitsOnly;
  }

  // 7. 12-digit number starting with '91' -> add '+'
  if (digitsOnly.length === 12 && digitsOnly.startsWith('91')) {
    return '+' + digitsOnly;
  }

  // 8. General fallback for international digits without + prefix
  return '+' + digitsOnly;
}
