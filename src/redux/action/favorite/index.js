import Types from '../../constant'
import FavoriteDao from '../../../utils/cache/FavoriteDao'
import ProjectModel from '../../../utils/model/ProjectModel'

/**
 * 加载收藏的项目
 * @param flag 标识
 * @param isShowLoading 是否显示loading
 * @returns {Function}
 */
export function onLoadFavoriteData (flag, isShowLoading) {
  return dispatch => {
    if (isShowLoading) {
      dispatch({
        type: Types.FAVORITE_LOAD_DATA,
        storeName: flag
      })
    }
    new FavoriteDao(flag).getAllItems().then(items => {
      let resultData = []
      for (let i = 0, length = items.length; i < length; i++) {
        resultData.push(new ProjectModel(items[i], true))
      }
      dispatch({
        type: Types.FAVORITE_LOAD_SUCCESS,
        projectModels: resultData,
        storeName: flag
      })
    }).catch(error => {
      console.log(error)
      dispatch({
        type: Types.FAVORITE_LOAD_FAIL,
        error,
        storeName: flag
      })
    })
  }
}
