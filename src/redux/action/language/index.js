import Types from '../../constant'
import LanguageDao from '../../../utils/cache/LanguageDao'

/**
 * 加载收藏的项目
 * @returns {Function}
 * @param flagKey
 */
export function onLoadLanguage (flagKey) {
  return async dispatch => {
    try {
      let languages = await new LanguageDao(flagKey).fetch()
      dispatch({
        type: Types.LANGUAGE_LOAD_SUCCESS,
        languages,
        flag: flagKey
      })
    } catch (e) {
      console.log(e)
    }
  }
}
