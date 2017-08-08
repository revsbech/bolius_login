

class BoliusApi {
  /**
   * Return a promise that should be used to fetch a user.
   *
   * @param token
   * @returns {*}
   */
  static getUser(token) {
    return fetch('https://api.bolius.dk/users/v2/me', {
      method: 'get',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }).then(result => {
      if (result.ok) {
        return result.json();
      }
      throw new Error("Brugeren findes ikke i api.bolius.dk");
    });
  }
}

export default BoliusApi;
