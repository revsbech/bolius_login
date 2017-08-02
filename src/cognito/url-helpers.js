export const isHusetskalender = () => {
  if (
    getQueryVariable('ref') === 'husetskalender'
    || localStorage.getItem('ref') === 'husetskalender'
  ) {
    localStorage.setItem('ref', 'husetskalender');
    return true;
  }
  return false;
};

export const getSuccessRedirectUrl = () => {
  const successUrl = getQueryVariable('success_url');
  if (successUrl) {
    localStorage.setItem('successUrl', successUrl);
  }

  return localStorage.getItem('successUrl');
};

export const getFailureRedirectUrl = () => {
  const failureUrl = getQueryVariable('failure_url');
  if (failureUrl) {
    localStorage.setItem('failureUrl', failureUrl);
  }

  return localStorage.getItem('failureUrl');
};

export const resetRedirectUrls = () => {
  localStorage.removeItem('successUrl');
  localStorage.removeItem('failureUrl');
  localStorage.removeItem('ref');
};

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  console.log('Query variable %s not found', variable);
}