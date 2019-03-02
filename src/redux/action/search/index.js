import Types from '../../constant'
import { _projectModels, doCallBack, handleData } from '../../../utils/ActionUtil'
import ArrayUtil from '../../../utils/ArrayUtil'
import Utils from '../../../utils/'

const API_URL = 'https://api.github.com/search/repositories?q='
const QUERY_STR = '&sort=stars'
const CANCEL_TOKENS = []

/**
 * 发起搜索
 * @param inputKey
 * @param pageSize
 * @param token
 * @param favoriteDao
 * @param popularKeys
 * @param callBack
 * @returns {Function}
 */
export function onSearch (inputKey, pageSize, token, favoriteDao, popularKeys, callBack) {
  return dispatch => {
    dispatch({ type: Types.SEARCH_REFRESH })
    fetch(getFetchUrl(inputKey)).then(response => {
      //如果任务取消，则不做任何处理
      return hasCancel(token) ? null : response.json()
    }).then(res => {
      if (hasCancel(token, true)) {
        //如果任务取消，则不做任何处理
        console.log('user cancel')
        return
      }
      if (!res || !res.items || res.items.length === 0) {
        dispatch({ type: Types.SEARCH_REFRESH_FAIL, message: `没找到关于${inputKey}的项目` })
        doCallBack(callBack, `没找到关于${inputKey}的项目`)
        return
      }
      let items = res.items
      handleData(Types.SEARCH_REFRESH_SUCCESS, dispatch, '', { data: items }, pageSize, favoriteDao, {
        showBottomButton: !Utils.checkKeyIsExist(popularKeys, inputKey),
        inputKey
      })
    }).catch(err => {
      console.log(err)
      dispatch({ type: Types.SEARCH_REFRESH_FAIL, error: err })
    })
  }

}

/**
 * 取消一个异步任务
 * @param token
 * @returns {Function}
 */
export function onSearchCancel (token) {
  return dispatch => {
    CANCEL_TOKENS.push(token)
    dispatch({ type: Types.SEARCH_CANCEL })
  }
}

export function onLoadMoreSearch (pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => {
      if ((pageIndex - 1) * pageSize >= dataArray.length) {
        if (typeof callBack === 'function') {
          callBack('no more')
        }
        dispatch({
          type: Types.SEARCH_LOAD_MORE_FAIL,
          error: 'no more',
          pageIndex: --pageIndex
        })
      } else {
        //本次和载入的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.SEARCH_REFRESH_SUCCESS,
            pageIndex,
            projectModels: data
          })
        })
      }
    }, 500)
  }
}

/**
 * 拼接url
 * @param key
 * @returns {string}
 */
function getFetchUrl (key) {
  return `${API_URL}${key}${QUERY_STR}`
}

/**
 * 检查指定token是否已取消
 * @param token
 * @param isRemove
 * @returns {boolean}
 */
function hasCancel (token, isRemove) {
  if (CANCEL_TOKENS.includes(token)) {
    isRemove && ArrayUtil.remove(CANCEL_TOKENS, token)
    return true
  }
  return false
}