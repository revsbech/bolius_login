export const signInTwitter = (response, cb, history, props) => {
  let accessToken = response.accessToken;

  localStorage.setItem('twitterccessToken', accessToken);
  history.push('/dashboard')
};