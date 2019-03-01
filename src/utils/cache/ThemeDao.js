import { AsyncStorage } from 'react-native'
import ThemeFactory, { ThemeFlags } from '../../assets/styles/ThemeFactory'

const THEME_KEY = 'theme_key'

export default class ThemeDao {

  /**
   * 获取当前主题
   * @returns {Promise<any>}
   */
  getTheme () {
    return new Promise((resolve, reject) => {
      AsyncStorage.getItem(THEME_KEY, (error, result) => {
        if (error) {
          reject(error)
          return
        }
        if (!result) {
          this.saveTheme(ThemeFlags.Default)
          result = ThemeFlags.Default
        }
        resolve(ThemeFactory.createTheme(result))
      })
    })
  }

  /**
   * 保存主题标识
   * @param themeFlag
   */
  saveTheme (themeFlag) {
    AsyncStorage.setItem(THEME_KEY, themeFlag, (error => {}))
  }
}