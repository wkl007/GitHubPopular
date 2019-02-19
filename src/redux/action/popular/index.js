import Types from '../../constant'
import DateStore, { FLAG_STOREGE } from '../../../utils/cache/DataStore'
import { _projectModels, handleData } from '../../../utils/actionUtil'

/**
 * 获取最热数据的异步action
 * @returns {{theme: *, type: string}}
 * @param storeName
 * @param url
 * @param pageSize
 * @param favoriteDao
 */
export function onRefreshPopular (storeName, url, pageSize, favoriteDao) {
  return dispatch => {
    dispatch({ type: Types.POPULAR_REFRESH, storeName })
    let dataStore = new DateStore()
    //异步action与数据流
    dataStore.fetchData(url, FLAG_STOREGE.flag_popular).then(res => {
      handleData(Types.POPULAR_REFRESH_SUCCESS, dispatch, storeName, res, pageSize, favoriteDao)
    }).catch(err => {
      console.log(err)
      dispatch({
        type: Types.POPULAR_REFRESH_FAIL,
        storeName,
        err
      })
    })
  }
}

/**
 * 加载更多
 * @param storeName 分类名称
 * @param pageIndex 第几页
 * @param pageSize 每页展示数据
 * @param dataArray 原始数据
 * @param favorite
 * @param callBack 回调函数，可以通过回调函数来向调用页面通信：比如异常信息的展示，没有更多等待
 */
export function onLoadMorePopular (storeName, pageIndex, pageSize, dataArray = [], favoriteDao, callBack) {
  return dispatch => {
    setTimeout(() => {//模拟网络请求
      if ((pageIndex - 1) * pageSize >= dataArray.length) {//已加载完全部数据
        if (typeof callBack === 'function') {
          callBack('no more')
          dispatch({
            type: Types.POPULAR_LOAD_MORE_FAIL,
            error: 'no more',
            storeName,
            pageIndex: --pageIndex,
          })
        }
      } else {
        //本次和加载的最大数量
        let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
        _projectModels(dataArray.slice(0, max), favoriteDao, data => {
          dispatch({
            type: Types.POPULAR_LOAD_MORE_SUCCESS,
            storeName,
            pageIndex,
            projectModels: data
          })
        })
      }
    }, 200)
  }
}

/**
 * 刷新收藏状态
 * @param storeName
 * @param pageIndex 第几页
 * @param pageSize 每页展示条数
 * @param dataArray 原始数据
 * @param favoriteDao
 * @returns {Function}
 */
export function onFlushPopularFavorite (storeName, pageIndex, pageSize, dataArray = [], favoriteDao) {
  return dispatch => {
    //本次和载入的最大数量
    let max = pageSize * pageIndex > dataArray.length ? dataArray.length : pageSize * pageIndex
    _projectModels(dataArray.slice(0, max), favoriteDao, data => {
      dispatch({
        type: Types.POPULAR_LOAD_MORE_SUCCESS,
        storeName,
        pageIndex,
        projectModels: data
      })
    })
  }
}

