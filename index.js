import { AppRegistry } from 'react-native'
import App from './App'
import AppNavigators from './demo/navigators/AppNavigators'
import WelcomePage from './src/pages/WelcomePage'
import { name as appName } from './app.json'

AppRegistry.registerComponent(appName, () => AppNavigators)
