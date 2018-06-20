let qs = require('qs');

export default class HttpUtils {
  static get(url) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain, */*'
        }
      })
        .then(response => response.json())
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })
  }

  static post(url, data) {
    return new Promise((resolve, reject) => {
      fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Accept': 'application/json, text/plain, */*',
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: qs.stringify(data)
      })
        .then(response => response.json())
        .then(result => {
          resolve(result)
        })
        .catch(err => {
          reject(err)
        })
    })

  }
}