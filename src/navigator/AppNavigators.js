import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
import { connect } from 'react-redux'
import {
  createReactNavigationReduxMiddleware,
  reduxifyNavigator
} from 'react-navigation-redux-helpers'
import WelcomePage from '../pages/WelcomePage'
import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage'
import WebViewPage from '../pages/WebViewPage'
import AboutPage from '../pages/about/AboutPage'
import AboutMePage from '../pages/about/AboutMePage'
import CustomKeyPage from '../pages/CustomKeyPage'
import SortKeyPage from '../pages/SortKeyPage'
import SearchPage from '../pages/SearchPage'

export const RootRoute = 'Init'//设置根路由

const InitNavigator = createStackNavigator(
  {
    WelcomePage: {
      screen: WelcomePage,
    }
  },
  {
    defaultNavigationOptions: {
      header: null// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
    }
  }
)

const MainNavigator = createStackNavigator(
  {
    HomePage: {
      screen: HomePage,
    },
    DetailPage: {
      screen: DetailPage,
    },
    WebViewPage: {
      screen: WebViewPage
    },
    AboutPage: {
      screen: AboutPage
    },
    AboutMePage: {
      screen: AboutMePage
    },
    CustomKeyPage: {
      screen: CustomKeyPage
    },
    SortKeyPage: {
      screen: SortKeyPage
    },
    SearchPage: {
      screen: SearchPage
    }
  },
  {
    defaultNavigationOptions: {
      header: null// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
    }
  }
)

export const RootNavigator = createAppContainer(createSwitchNavigator(
  {
    Init: InitNavigator,
    Main: MainNavigator
  },
  {
    initialRouteName: 'Init',
    backBehavior: 'none'
  }
  )
)

/**
 * 1.初始化react-navigation与redux的中间件，
 * 该方法的一个很大的作用就是为reduxifyNavigator的key设置actionSubscribers(行为订阅者)
 * 设置订阅者@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L29
 * 检测订阅者是否存在@https://github.com/react-navigation/react-navigation-redux-helpers/blob/master/src/middleware.js#L97
 * @type {Middleware}
 */
export const middleware = createReactNavigationReduxMiddleware(
  'root',
  state => state.nav
)

/**
 * 2.将根导航器组件传递给 reduxifyNavigator 函数,
 * 并返回一个将navigation state 和 dispatch 函数作为 props的新组件；
 * 注意：要在createReactNavigationReduxMiddleware之后执行
 */
const AppWithNavigationState = reduxifyNavigator(RootNavigator, 'root')

/**
 * State到Props的映射关系
 * @param state
 */
const mapStateToProps = state => ({
  state: state.nav
})

/**
 * 3.连接 React 组件与 Redux store
 */
export default connect(mapStateToProps)(AppWithNavigationState)
