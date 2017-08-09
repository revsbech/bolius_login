
export class BoliusApi {
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
        'Content-Type': 'application/x-www-form-urlencoded',
        'cache-control': 'no-cache'
      }
    }).then(result => {
      if (result.ok) {
        return result.json();
      }

      if (result.status === 404) {
        var err = new Error();
        err.type=404;
        throw err;
      }
      throw new Error("Fejl i kald til api.bolius.dk. Fejlkode: " + result.status + " Besked: " + result.statusText)
    });
  }

  static createUser(token, data) {
    return fetch('https://api.bolius.dk/users/v2/me', {
      method: 'post',
      headers: {
        'Authorization': 'Bearer ' + token,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: JSON.stringify({
        "data": {
          "type": "user",
          "attributes": data
        }
      })
    }).then(result => {
      if (result.ok) {
        return true;
      }
      throw new Error("Fejl under oprettelse af bruger i api.bolius.dk. Fejlkode" + result.status + "Besked: " + result.statusText);
    });
  }
}

export default BoliusApi;
