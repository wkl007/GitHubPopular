import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  DeviceEventEmitter
} from 'react-native'
import { StackActions, NavigationActions } from 'react-navigation'
import TabNavigator from 'react-native-tab-navigator'
import Toast, { DURATION } from 'react-native-easy-toast'
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
import BaseComponent from './BaseComponent'
import BackPressComponent from '../common/BackPressComponent'

export const FLAG_TAB = {
  flag_popularTab: 'tb_popular',
  flag_trendingTab: 'tb_trending',
  flag_favoriteTab: 'tb_favorite',
  flag_my: 'tb_my'
}

export const ACTION_HOME = {A_SHOW_TOAST: 'showToast', A_RESTART: 'restart', A_THEME: 'theme'}
export default class HomePage extends BaseComponent {
  constructor (props) {
    super(props)
    this.backPress = new BackPressComponent({backPress: (e) => this.onBackPress(e)})

    let {params} = this.props.navigation.state
    let selectedTab = params.selectedTab ? params.selectedTab : 'tb_popular'
    let theme = params.theme
    this.state = {
      selectedTab: selectedTab,
      theme: theme,
    }
  }

  componentDidMount () {
    this.backPress.componentDidMount()
    super.componentDidMount()
    this.listener = DeviceEventEmitter.addListener('ACTION_HOME', (action, params) => this.onAction(action, params))
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
    super.componentWillUnmount()
    this.listener && this.listener.remove()
  }

  /**
   * 处理安卓物理返回键
   * @param e
   * @returns {boolean}
   */
  onBackPress (e) {
    if (this.lastBackPressed && this.lastBackPressed + 2000 >= Date.now()) {
      //最近2秒内按过back键，可以退出应用。
      return false
    }
    this.lastBackPressed = Date.now()
    this.toast.show('再按一次退出应用', DURATION.LENGTH_LONG)
    return true
  }

  /**
   * 通知回调事件处理
   * @param action
   * @param params
   */
  onAction (action, params) {
    if (ACTION_HOME.A_RESTART === action) {
      this.onRestart(params)
    } else if (ACTION_HOME.A_SHOW_TOAST === action) {
      this.toast.show(params.text, DURATION.LENGTH_LONG)
    }
  }

  /**
   * 重启首页
   * @param jumpToTab
   */
  onRestart (jumpToTab) {
    let resetAction = StackActions.reset({
      index: 0,
      actions: [
        NavigationActions.navigate({routeName: 'HomePage', params: {selectedTab: jumpToTab, theme: this.state.theme}})
      ]
    })

    this.props.navigation.dispatch(resetAction)
  }

  /**
   * 遍历tab
   * @param Component
   * @param selectTab
   * @param title
   * @param renderIcon
   * @returns {*}
   * @private
   */
  _renderTab (Component, selectTab, title, renderIcon) {
    return (
      <TabNavigator.Item
        selected={this.state.selectedTab === selectTab}
        selectedTitleStyle={this.state.theme.styles.selectedTitleStyle}
        title={title}
        renderIcon={() => <Image style={styles.image} source={renderIcon}/>}
        renderSelectedIcon={() => <Image style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
                                         source={renderIcon}/>}
        onPress={() => this.setState({selectedTab: selectTab})}
      >
        <Component {...this.props} theme={this.state.theme}/>
      </TabNavigator.Item>
    )
  }

  render () {
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
})