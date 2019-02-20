import React, { Component } from 'react'
import {
  View,
  DeviceInfo,
  StyleSheet
} from 'react-native'
import { WebView } from 'react-native-webview'
import NavigationBar from '../components/NavigationBar'
import ViewUtil from '../utils/ViewUtil'
import NavigationUtil from '../utils/NavigationUtils'

const THEME_COLOR = '#678'

export default class WebViewPage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { title, url } = this.params
    this.state = {
      title,
      url,
      canGoBack: false
    }
  }

  componentDidMount () {

  }

  componentWillUnmount () {

  }

  onBackPress = () => {
    this.onBack()
    return true
  }

  onBack = () => {
    const { canGoBack } = this.state
    if (canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  onNavigationStateChange (navState) {}

  render () {
    const { title, url } = this.state
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const navigationBar = <NavigationBar
      title={title}
      statusBar={statusBar}
      leftButton={ViewUtil.getLeftBackButton(() => {this.onBackPress()})}
      style={{ backgroundColor: THEME_COLOR }}
    />
    return (
      <View style={styles.container}>
        {navigationBar}
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: DeviceInfo.isIPhoneX_deprecated ? 30 : 0
  },
})
