import React, { Component } from 'react'
import { BackHandler, StyleSheet, Text, View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'

import NavigationUtils from '../utils/NavigationUtils'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

class HomePage extends Component {
  componentDidMount () {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress)
  }

  componentWillUnmount () {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress)
  }

  /**
   * 处理安卓物理返回键
   * @returns {boolean}
   */
  onBackPress = () => {
    const { dispatch, nav } = this.props
    if (nav.routes[1].index === 0) {//如果RootNavigator中的MainNavigator的index为0，则不处理返回事件
      return false
    }
    dispatch(NavigationActions.back())
    return true
  }

  render () {
    const { navigation } = this.props
    NavigationUtils.navigation = navigation
    return <DynamicTabNavigator/>
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme
})

const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(HomePage)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
