import {
  createStackNavigator,
  createMaterialTopTabNavigator,
  createBottomTabNavigator,
  createSwitchNavigator,
  createAppContainer
} from 'react-navigation'
import WelcomePage from '../pages/WelcomePage'
import HomePage from '../pages/HomePage'
import DetailPage from '../pages/DetailPage'

const InitNavigator = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
    navigationOptions: {
      header: null
    }
  },

})

const MainNavigator = createStackNavigator({
  HomePage: {
    screen: HomePage,
    navigationOptions: {
      header: null
    }
  },
  DetailPage: {
    screen: DetailPage,
    navigationOptions: {
      header: null
    }
  }
})

const AppNavigators = createSwitchNavigator({
  Init: InitNavigator,
  Main: MainNavigator,
}, {
  navigationOptions: {
    header: null
  }
})

export default createAppContainer(AppNavigators)


