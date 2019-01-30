import Types from '../../constant'

const defaultState = {}

/**
 * popular:{
 *   java:{
 *     items:[],
 *     isLoading:false,
 *   },
 *   ios:{
 *     items:[],
 *     isLoading:false,
 *   }
 * }
 * 0.state树，横向扩展
 * 1.如何动态的设置store，和动态获取store(难点：store key不固定)；
 * @param state
 * @param action
 * @returns {{}}
 */
export default function onAction (state = defaultState, action) {
  switch (action.type) {
    case Types.POPULAR_REFRESH_SUCCESS://下拉刷新成功
      return {
        ...state,//原始数据
        [action.storeName]: {
          ...state[action.storeName],//原始数据
          items: action.items,//新数据
          isLoading: false
        }
      }
    case Types.POPULAR_REFRESH://下拉刷新
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: true
        }
      }
    case Types.POPULAR_REFRESH_FAIL://下拉刷新失败
      return {
        ...state,
        [action.storeName]: {
          ...state[action.storeName],
          isLoading: false
        }
      }
    default:
      return state
  }
}
