import ChatScreen from './ChatScreen'
import { createStackNavigator } from 'react-navigation'
import MainScreenNavigator from './MainScreenNavigator'

const navigationOptions = {
  header: null
}

const App = createStackNavigator({
  Home: {
    screen: MainScreenNavigator,
    navigationOptions: navigationOptions
  },
  Chat: {screen: ChatScreen, navigationOptions: navigationOptions}
})
export default App