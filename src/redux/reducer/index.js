import { combineReducers } from 'redux'
import { RootRoute, RootNavigator } from '../../navigator/AppNavigators'
import theme from './theme'
import popular from './popular'
import trending from './trending'

//1. 指定默认state
const navState = RootNavigator.router.getStateForAction(RootNavigator.router.getActionForPathAndParams(RootRoute))

//2. 创建自己的navigation reducer
const navReducer = (state = navState, action) => {
  const nextState = RootNavigator.router.getStateForAction(action, state)
  // 如果`nextState`为null或未定义，只需返回原始`state`
  return nextState || state
}

//3. 合并ruducer
export default combineReducers({
  nav: navReducer,
  theme,
  popular,
  trending
})
