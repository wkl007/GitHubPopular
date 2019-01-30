import { AsyncStorage } from 'react-native'
import Trending from 'GitHubTrending'
import request from '../../api/request'

export const FLAG_STOREGE = {
  flag_popular: 'popular',
  flag_trending: 'trending'
}

export default class DataStore {

  /**
   * 获取数据，优先获取本地数据，如果无本地数据或本地数据过期则获取网络数据
   * @param url
   * @param flag
   * @returns {Promise<any> | Promise<*>}
   */
  fetchData (url, flag) {
    return new Promise((resolve, reject) => {
      this.fetchLocalData(url).then(wrapData => {
        if (wrapData && DataStore.checkTimestampValid(wrapData.timestamp)) {
          resolve(wrapData)
        } else {
          this.fetchNetData(url, flag).then(res => {
            resolve(this._wrapData(res))
          }).catch(err => {reject(err)})
        }
      }).catch(err => {
        this.fetchNetData(url, flag).then(res => {
          resolve(this._wrapData(res))
        }).catch(err => {reject(err)})
      })
    })
  }

  /**
   * 保存数据
   * @param url url
   * @param data data
   * @param callback callback
   */
  saveData (url, data, callback) {
    if (!data || !url) return
    AsyncStorage.setItem(url, JSON.stringify(this._wrapData(data)), callback)
  }

  /**
   * 获取本地数据
   * @param url
   * @returns {Promise<any> | Promise<*>}
   */
  fetchLocalData (url) {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(url, (error, result) => {
        if (!error) {
          try {
            resolve(JSON.parse(result))
          } catch (e) {
            reject(e)
            console.error(e)
          }
        } else {
          reject(error)
          console.error(error)
        }
      })
    })
  }

  /**
   * 获取网络数据
   * @param url
   * @param flag
   * @returns {Promise<any> | Promise<*>}
   */
  fetchNetData (url, flag) {
    return new Promise((resolve, reject) => {
      if (flag !== FLAG_STOREGE.flag_trending) {
        request(url).then(res => {
          this.saveData(url, res)
          resolve(res)
        }).catch(err => {reject(err)})
      } else {
        new Trending().fetchTrending(url).then(res => {
          if (!res) {
            throw new Error('responseData is null')
          }
          this.saveData(url, res)
          resolve(res)
        }).catch(err => {reject(err)})
      }
    })
  }

  _wrapData (data) {
    return { data: data, timestamp: new Date().getTime() }
  }

  /**
   * 检查timestamp是否在有效期内
   * @param timestamp 项目更新时间
   * @param validityPeriod 项目有效期
   * @returns {boolean}  true 不需要更新,false需要更新
   */
  static checkTimestampValid (timestamp, validityPeriod = 4) {
    const currentDate = new Date()
    const targetDate = new Date()
    targetDate.setTime(timestamp)
    if (currentDate.getMonth() !== targetDate.getMonth()) return false
    if (currentDate.getDate() !== targetDate.getDate()) return false
    if (currentDate.getHours() - targetDate.getHours() > validityPeriod) return false
    // if (currentDate.getMinutes() - targetDate.getMinutes() > 1)return false;
    return true
  }
}
