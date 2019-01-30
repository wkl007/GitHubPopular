import Types from '../../constant'
import DateStore, { FLAG_STOREGE } from '../../../utils/cache/DataStore'

/**
 * 获取最热数据的异步action
 * @returns {{theme: *, type: string}}
 * @param storeName
 * @param url
 */
export function onLoadPopularData (storeName, url) {
  return dispatch => {
    dispatch({ type: Types.POPULAR_REFRESH, storeName })
    let dataStore = new DateStore()
    //异步action与数据流
    dataStore.fetchData(url, FLAG_STOREGE.flag_popular).then(res => {
      handleData(dispatch, storeName, res)
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

function handleData (dispatch, storeName, data) {
  dispatch({
    type: Types.POPULAR_REFRESH_SUCCESS,
    items: data && data.data && data.data.items,
    storeName
  })
}
