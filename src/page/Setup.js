import {StackNavigator} from 'react-navigation'
import CardStackStyleInterpolator from 'react-navigation/src/views/CardStack/CardStackStyleInterpolator'
import WelcomePage from './WelcomePage'
import HomePage from './HomePage'
import CustomKeyPage from './my/CustomKeyPage'
import SortKeyPage from './my/SortKeyPage'
import RepositoryDetail from './RepositoryDetail'
import PopularPage from './PopularPage'

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
