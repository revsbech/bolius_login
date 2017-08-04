export const signInTwitter = (token, cb, history, props) => {

  localStorage.setItem('twitterAccessToken', token);
  history.push('/dashboard')
};