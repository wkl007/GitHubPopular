import Types from '../../constant'
import DateStore, { FLAG_STOREGE } from '../../../utils/cache/DataStore'

/**
 * 获取最热数据的异步action
 * @returns {{theme: *, type: string}}
 * @param storeName
 * @param url
 */
export function onRefreshPopular (storeName, url, pageSize) {
  return dispatch => {
    dispatch({ type: Types.POPULAR_REFRESH, storeName })
    let dataStore = new DateStore()
    //异步action与数据流
    dataStore.fetchData(url, FLAG_STOREGE.flag_popular).then(res => {
      handleData(dispatch, storeName, res, pageSize)
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
 * @param callback 回调函数，可以通过回调函数来向调用页面通信:比如异常信息的展示，没有更多等待
 */
export function onLoadMorePopular (storeName, pageIndex, pageSize, dataArray = [], callBack) {
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
        dispatch({
          type: Types.POPULAR_LOAD_MORE_SUCCESS,
          storeName,
          pageIndex,
          projectModels: dataArray.slice(0, max)
        })
      }
    }, 200)
  }
}

function handleData (dispatch, storeName, data, pageSize) {
  let fixItems = []
  if (data && data.data && data.data.items) {
    fixItems = data.data.items
  }
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    items: fixItems,
    projectModels: pageSize > fixItems.length ? fixItems : fixItems.slice(0, pageSize),//第一次要加载的数据
    storeName,
    pageIndex: 1
  })
}
