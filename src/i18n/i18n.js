/**
 *
 * @param args
 * @returns {string}
 */
export const i18n = (...args) => {
  const strings = {
    'InvalidParameterException': 'Udfyld venligst alle felter',
    'UserNotFoundException': 'Brugeren kunne ikke findes',
    'InvalidPasswordException': 'Kodeord skal indholde minimum 8 karakter med minimum 1 stort bogstav, 1 lille bogstav, 1 tal, og 1 symbol',
  };

  if (typeof args[0] === 'undefined') {
    console.warn('Missing argument');
  }

  let result = strings[args[0]];
  if (result) return result;

  return args[0];
};
