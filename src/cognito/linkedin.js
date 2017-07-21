export const signInLinkedin = (response, cb, history, props) => {
  let accessToken = response.accessToken;

  localStorage.setItem('linkedinAccessToken', accessToken);
  history.push('/dashboard')
};