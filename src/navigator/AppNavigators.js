import {
  createStackNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
import WelcomePage from '../pages/WelcomePage'
import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage'

const InitNavigator = createStackNavigator({
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
    }
  },
  {
    defaultNavigationOptions: {
      header: null// 可以通过将header设为null 来禁用StackNavigator的Navigation Bar
    }
  }
)

let RootNavigator
export default RootNavigator = createAppContainer(createSwitchNavigator(
  {
    Init: InitNavigator,
    Main: MainNavigator
  })
)