import DataRepository, { FLAG_STORAGE } from './DataRepository'
import Utils from '../../util/Utils'

export default class RepositoryUtils {
  constructor (aboutCommon) {
    this.aboutCommon = aboutCommon
    this.dataRepository = new DataRepository(FLAG_STORAGE.flag_my)
    this.itemMap = new Map()
  }

  /**
   *更新数据
   * @param key
   * @param value
   */
  updateData (key, value) {
    this.itemMap.set(key, value)
    let arr = []
    for (let value of this.itemMap.values()) {
      arr.push(value)
    }
    this.aboutCommon.onNotifyDataChanged(arr)
  }

  /**
   *获取指定url下的数据
   * @param url
   */
  fetchRepository (url) {
    this.dataRepository.fetchNetRepository(url)
      .then(result => {
        if (result) {
          this.updateData(url, result)
          if (!Utils.checkDate(result.update_date))
            return this.dataRepository.fetchNetRepository(url)
        } else {
          return this.dataRepository.fetchNetRepository(url)
        }
      }).then((item) => {
      if (item) {
        this.updateData(url, item)
      }
    }).catch(err => {

    })
  }

  /**
   * 批量获取url对应的数据
   * @param urls
   */
  fetchRepositories (urls) {
    for (let i = 0, len = urls.length; i < len; i++) {
      let url = urls[i]
      this.fetchRepository(url)
    }
  }
}