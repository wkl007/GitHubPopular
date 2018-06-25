import React, { Component } from 'react'
import {
  StyleSheet,
  View,
  Image,
  DeviceEventEmitter,
} from 'react-native'
import NavigatorUtil from '../util/NavigatorUtil'
import TabNavigator from 'react-native-tab-navigator'
import Toast, { DURATION } from 'react-native-easy-toast'
import ThemeFactory, { ThemeFlags } from '../assets/styles/ThemeFactory'
import PopularPage from './PopularPage'
import TrendingPage from './TrendingPage'
import FavoritePage from './FavoritePage'
import MyPage from './my/MyPage'
import BaseComponent from './BaseComponent'
import BackPressComponent from '../common/BackPressComponent'
import SafeAreaViewPlus from '../common/SafeAreaViewPlus'

export const FLAG_TAB = {
  flag_popularTab: 'tb_popular',
  flag_trendingTab: 'tb_trending',
  flag_favoriteTab: 'tb_favorite',
  flag_my: 'tb_my',
}

export const ACTION_HOME = {
  A_SHOW_TOAST: 'showToast',
  A_RESTART: 'restart',
  A_THEME: 'theme',
  A_HOME_TAB_SELECT: 'home_tab_select',
}
export const EVENT_TYPE_HOME_TAB_SELECT = 'home_tab_select'

export default class HomePage extends BaseComponent {
  constructor (props) {
    super(props)
    this.backPress = new BackPressComponent(
      {backPress: (e) => this.onBackPress(e)})

    this.params = this.props.navigation.state.params
    let selectedTab = this.params.selectedTab || 'tb_popular'
    let theme = this.params.theme
    this.state = {
      selectedTab: selectedTab,
      theme: theme,
    }
  }

  componentDidMount () {
    this.backPress.componentDidMount()
    super.componentDidMount()
    this.listener = DeviceEventEmitter.addListener('ACTION_HOME',
      (action, params) => this.onAction(action, params),
    )
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
    const {navigation} = this.props
    const {theme} = this.state
    NavigatorUtil.resetToHomePage({
      ...this.params,
      navigation: navigation,
      selectedTab: jumpToTab,
      theme: theme,
    })
  }

  onTabClick (from, to) {
    this.setState({selectedTab: to})
    DeviceEventEmitter.emit(EVENT_TYPE_HOME_TAB_SELECT, from, to)
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
        renderSelectedIcon={() => <Image
          style={[styles.image, this.state.theme.styles.tabBarSelectedIcon]}
          source={renderIcon}/>}
        onPress={() => this.onTabClick(this.state.selectedTab, selectTab)}
      >
        <Component {...this.props} theme={this.state.theme}/>
      </TabNavigator.Item>
    )
  }

  render () {
    const Root = <SafeAreaViewPlus
      topColor={this.state.theme.themeColor}
      bottomInset={false}
    >
      <TabNavigator>
        {this._renderTab(PopularPage, FLAG_TAB.flag_popularTab, '最热',
          require('../assets/images/ic_polular.png'))}
        {this._renderTab(TrendingPage, FLAG_TAB.flag_trendingTab, '趋势',
          require('../assets/images/ic_trending.png'))}
        {this._renderTab(FavoritePage, FLAG_TAB.flag_favoriteTab, '收藏',
          require('../assets/images/ic_favorite.png'))}
        {this._renderTab(MyPage, FLAG_TAB.flag_my, '我的',
          require('../assets/images/ic_my.png'))}
      </TabNavigator>
      <Toast ref={toast => this.toast = toast}/>
    </SafeAreaViewPlus>
    return Root
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5fcff',
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
    margin: 5,
  },
})