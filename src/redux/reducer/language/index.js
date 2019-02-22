import Types from '../../constant'
import { FLAG_LANGUAGE } from '../../../utils/cache/LanguageDao'

const defaultState = {
  languages: [],
  keys: []
}

/**
 *
 * @param state
 * @param action
 * @returns {{languages: Array, keys: Array}}
 */
export default function onAction (state = defaultState, action) {
  switch (action.type) {
    case Types.LANGUAGE_LOAD_SUCCESS://获取数据成功
      if (FLAG_LANGUAGE.flag_key === action.flag) {
        return {
          ...state,
          keys: action.languages
        }
      } else {
        return {
          ...state,
          languages: action.languages
        }
      }
    default:
      return state
  }
}
