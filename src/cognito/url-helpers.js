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

export const resetRedirectUrls = () => {
  localStorage.removeItem('redirect_url');
  localStorage.removeItem('ref');
};

export const getTwitterOauthToken = () => getQueryVariable('token');

export function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split('&');
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split('=');
    if (decodeURIComponent(pair[0]) === variable) {
      return decodeURIComponent(pair[1]);
    }
  }
}