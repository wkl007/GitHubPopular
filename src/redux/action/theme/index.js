import Types from '../../constant'
import ThemeDao from '../../../utils/cache/ThemeDao'

/**
 * 主题更改
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onThemeChange (theme) {
  return { type: Types.THEME_CHANGE, theme }
}

/**
 * 初始化主题
 * @returns {Function}
 */
export function onThemeInit () {
  return dispatch => {
    new ThemeDao().getTheme().then(data => {
      dispatch(onThemeChange(data))
    })
  }
}

/**
 * 显示自定义主题弹窗
 * @param show
 * @returns {{type: string, customThemeVisible: *}}
 */
export function onShowCustomThemeView (show) {
  return { type: Types.SHOW_THEME_VIEW, customThemeViewVisible: show }
}
