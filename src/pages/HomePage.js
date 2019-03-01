import React, { Component } from 'react'
import { BackHandler, StyleSheet, Text, View } from 'react-native'
import { NavigationActions } from 'react-navigation'
import { connect } from 'react-redux'
import actions from '../redux/action'
import BackPressComponent from '../components/BackPressComponent'
import CustomTheme from '../pages/CustomTheme'
import NavigationUtil from '../utils/NavigationUtil'
import DynamicTabNavigator from '../navigator/DynamicTabNavigator'
import GlobalStyles from '../assets/styles/GlobalStyles'

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

  renderCustomThemeView = () => {
    const { customThemeViewVisible, onShowCustomThemeView } = this.props
    return (
      <CustomTheme
        visible={customThemeViewVisible}
        {...this.props}
        onClose={() => onShowCustomThemeView(false)}
      />
    )
  }

  render () {
    const { navigation } = this.props
    NavigationUtil.navigation = navigation
    return <View style={GlobalStyles.root_container}>
      <DynamicTabNavigator/>
      {this.renderCustomThemeView()}
    </View>
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
  theme: state.theme.theme,
  customThemeViewVisible: state.theme.customThemeViewVisible
})

const mapDispatchToProps = dispatch => ({
  onShowCustomThemeView: show => dispatch(actions.onShowCustomThemeView(show))
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
