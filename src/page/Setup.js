import { createStackNavigator } from 'react-navigation'
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'
import WebViewPage from './WebViewPage'
import SearchPage from './SearchPage'
import CustomKeyPage from './my/CustomKeyPage'
import SortKeyPage from './my/SortKeyPage'
import RepositoryDetail from './RepositoryDetail'
import PopularPage from './PopularPage'
import AboutPage from './about/AboutPage'
import AboutMePage from './about/AboutMePage'

const App = createStackNavigator({
  WelcomePage: {
    screen: WelcomePage,
  },
  HomePage: {
    screen: HomePage,
  },
  WebViewPage: {
    screen: WebViewPage,
  },
  SearchPage: {
    screen: SearchPage,
  },
  PopularPage: {
    screen: PopularPage,
  },
  CustomKeyPage: {
    screen: CustomKeyPage,
  },
  SortKeyPage: {
    screen: SortKeyPage,
  },
  RepositoryDetail: {
    screen: RepositoryDetail,
  },
  AboutPage: {
    screen: AboutPage,
  },
  AboutMePage: {
    screen: AboutMePage,
  }
}, {
  navigationOptions: {
    header: null,
  },
})

export default App
