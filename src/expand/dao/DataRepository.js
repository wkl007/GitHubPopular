import {
  AsyncStorage,
} from 'react-native';
import Trending from 'GitHubTrending';
export let FLAG_STORAGE = {flag_popular: 'popular', flag_trending: 'trending', flag_my: 'my'};

export default class DataRepository {
  constructor(flag) {
    this.flag = flag;
    if (flag === FLAG_STORAGE.flag_trending) this.treding = new Trending();
  }

  /**
   * 保存数据
   * @param url
   * @param items
   * @param callback
   */
  saveRepository(url, items, callback) {
    if (!items || !url) return;
    let wrapData;//本地存储网络数据
    if (this.flag === FLAG_STORAGE.flag_my) {
      wrapData = {item: items, update_date: new Date().getTime()}
    } else {
      wrapData = {items: items, update_date: new Date().getTime()}
    }
    AsyncStorage.setItem(url, JSON.stringify(wrapData), callback)
  }

  fetchRepository(url) {
    return new Promise((resolve, reject) => {
      //获取本地数据
      this.fetchLocalRepository(url).then((wrapData) => {
        if (wrapData) {
          resolve(wrapData, true)
        } else {
          this.fetchNetRepository(url).then((data) => {
            resolve(data)
          }).catch((error) => {
            reject(error);
          })
        }
      }).catch((error) => {
        this.fetchNetRepository(url).then((data) => {
          resolve(data)
        }).catch((error) => {
          reject(error);
        })
      })
    })
  }

  /**
   * 获取本地数据
   * @param url
   * @returns {Promise<any>}
   */
  fetchLocalRepository(url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e);
            console.error(e);
          }
        } else {
          reject(error);
          console.error(error);
        }
      })
    })
  }

  /**
   * 获取网络数据
   * @param url
   * @returns {Promise<any>}
   */
  fetchNetRepository(url) {
    return new Promise((resolve, reject) => {
      if (this.flag !== FLAG_STORAGE.flag_trending) {
        fetch(url)
          .then(response => response.json())
          .catch(err => {
            reject(err)
          })
          .then(result => {
            if (this.flag === FLAG_STORAGE.flag_my && result) {
              this.saveRepository(url, result);
              resolve(result)
            }else if(result&&result.items){
              this.saveRepository(url, result.items);
              resolve(result.items);
            }else {
              reject(new Error('responseData is null'));
            }
          })

      } else {
        this.treding.fetchTrending(url)
          .then((items) => {
            if (!items) {
              reject(new Error('responseData is null'));
            }
            resolve(items);
            this.saveRepository(url, items);
          })
          .catch((err) => {
            reject(err)
          })
      }
    })
  }
}