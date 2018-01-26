import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  DeviceEventEmitter
} from 'react-native'
import {NavigationActions} from 'react-navigation'
import TabNavigator from 'react-native-tab-navigator';
import Toast, {DURATION} from 'react-native-easy-toast'
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
const resetAction = NavigationActions.reset({
  index: 0,
  actions: [
    NavigationActions.navigate({routeName: 'HomePage'})
  ]
});

export const ACTION_HOME = {A_SHOW_TOAST: 'showToast', A_RESTART: 'restart', A_THEME: 'theme'};
export default class HomePage extends Component {
  constructor(props) {
    super(props);
    console.log(NavigationActions);
    this.state = {
      selectedTab: 'tb_popular'
    }
  }

  componentDidMount() {
    this.listener = DeviceEventEmitter.addListener('ACTION_HOME', (action, params) => this.onAction(action, params));
  }

  /**
   * 通知回调事件处理
   * @param action
   * @param params
   */
  onAction(action, params) {
    if (ACTION_HOME.A_RESTART === action) {
      this.onRestart(params)
    } else if (ACTION_HOME.A_SHOW_TOAST === action) {
      this.toast.show(params.text, DURATION.LENGTH_LONG);
    }
  }

  /**
   * 重启首页
   * @param jumpToTab
   */
  onRestart(jumpToTab) {
    this.props.navigation.dispatch(resetAction)
  }


  componentWillUnmount() {
    this.listener && this.listener.remove();
  }

  //遍历tab
  _renderTab(Component, selectTab, title, renderIcon) {
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectTab}
        selectedTitleStyle={{color: '#2196F3'}}
        title={title}
        renderIcon={() => <Image style={styles.image} source={renderIcon}/>}
        renderSelectedIcon={() => <Image style={[styles.image, {tintColor: '#2196F3'}]}
                                         source={renderIcon}/>}
        onPress={() => this.setState({selectedTab: selectTab})}
      >
        <Component {...this.props}/>
      </TabNavigator.Item>
    )
  }

  render() {
    return (
      <View style={styles.container}>
        <TabNavigator>
          {this._renderTab(PopularPage, 'tb_popular', '最热', require('../assets/images/ic_polular.png'))}
          {this._renderTab(TrendingPage, 'tb_trending', '趋势', require('../assets/images/ic_trending.png'))}
          {this._renderTab(FavoritePage, 'tb_favorite', '收藏', require('../assets/images/ic_favorite.png'))}
          {this._renderTab(MyPage, 'tb_my', '我的', require('../assets/images/ic_my.png'))}
        </TabNavigator>
        <Toast ref={toast => this.toast = toast}/>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff'
  },
  page1: {
    flex: 1,
    backgroundColor: 'red',
  },
  page2: {
    flex: 1,
    backgroundColor: 'yellow',
  },
  image: {
    height: 22,
    width: 22,
    margin: 5
  }
});