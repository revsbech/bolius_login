export const signInGoogle = (response, cb, history, props) => {
  let accessToken = response.accessToken;

  localStorage.setItem('googleAccessToken', accessToken);
  history.push('/dashboard')
};