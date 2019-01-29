import Types from '../../constant'

/**
 * 主题更改
 * @param theme
 * @returns {{theme: *, type: string}}
 */
export function onThemeChange (theme) {
  return { type: Types.THEME_CHANGE, theme }
}
