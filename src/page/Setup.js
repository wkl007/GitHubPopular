import {StackNavigator} from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'
import CustomKeyPage from './my/CustomKeyPage'
import SortKeyPage from './my/SortKeyPage'
import RepositoryDetail from './RepositoryDetail'
import PopularPage from './PopularPage'
import AboutPage from './about/AboutPage'
import AboutMePage from './about/AboutMePage'

const App = StackNavigator({
  WelcomePage: {
    screen: WelcomePage,
  },
  HomePage: {
    screen: HomePage,
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
  AboutPage:{
    screen: AboutPage,
  },
  AboutMePage:{
    screen: AboutMePage,
  }
}, {
  mode: 'card',
  headerMode: 'screen',
  navigationOptions: {
    header: null,
    cardStack: {
      gesturesEnabled: false
    }
  },
  transitionConfig: () => ({
    screenInterpolator: CardStackStyleInterpolator.forHorizontal,
  })
});

export default App;
