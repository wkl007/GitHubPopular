import React, { Component } from 'react'
import { BackHandler, StyleSheet, Text, View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import BackPressComponent from '../components/BackPressComponent'
import NavigationUtil from '../utils/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'

class HomePage extends Component {
  constructor (props) {
    super(props)
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }

  componentDidMount () {
    this.backPress.componentDidMount()
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  /**
   * 处理安卓物理返回键
   * @returns {boolean}
   * https://reactnavigation.org/docs/en/redux-integration.html#handling-the-hardware-back-button-in-android
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
    NavigationUtil.navigation = navigation
    return <DynamicTabNavigator/>
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme
})

/*const mapDispatchToProps = dispatch => ({
  onThemeChange: theme => dispatch(actions.onThemeChange(theme))
})*/

export default connect(
  mapStateToProps
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
