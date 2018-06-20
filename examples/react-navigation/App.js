import ChatScreen from './ChatScreen'
import {StackNavigator} from 'react-navigation'
import MainScreenNavigator from './MainScreenNavigator'

const navigationOptions = {
  header: null
};

const App = StackNavigator({
  Home: {
    screen: MainScreenNavigator,
    navigationOptions: navigationOptions
  },
  Chat: {screen: ChatScreen, navigationOptions: navigationOptions}
});
export default App;