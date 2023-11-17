// Settings
// Dependencies
import * as _ from 'lodash';
import { parsePhoneNumber, CountryCode, isValidPhoneNumber } from 'libphonenumber-js';

export const normalizePhoneNumber = (phoneNumber: string) => {
  if (!phoneNumber) {
    return null;
  }

  try {
    let phoneNumberObject = parsePhoneNumber(phoneNumber);
    let isValid = phoneNumberObject && isPhoneNumber(phoneNumberObject.number);

    if (isValid) {
      return phoneNumberObject.number as string;
    }

    const phoneNumberWithPlus = `+${phoneNumber.replace(/[()+\- ]/g, '')}`;

    phoneNumberObject = parsePhoneNumber(phoneNumberWithPlus);
    isValid = phoneNumberObject && isPhoneNumber(phoneNumberObject.number);

    if (isValid) {
      return phoneNumberObject.number as string;
    }
  } catch (err) {
    // silent fail
  }

  const normalizedNumber = phoneNumber.replace(/[()+\- ]/g, '');
  const isPhoneNumberWithPlus = isPhoneNumber(`+${normalizedNumber}`);

  if (isPhoneNumberWithPlus) {
    // prepend + sign
    return `+${normalizedNumber}`;
  }

  return normalizedNumber;
};

export const isPhoneNumber = (n: any) => {
  if (!n) {
    return false;
  }

  return isValidPhoneNumber(n);
};
