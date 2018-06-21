import React, { Component } from 'react'
import {
  View,
  WebView,
} from 'react-native'
import NavigationBar from '../../src/common/NavigationBar'
import GlobalStyles from '../assets/styles/GlobalStyles'
import ViewUtils from '../util/ViewUtils'
import NavigatorUtil from '../util/NavigatorUtil'
import BackPressComponent from '../common/BackPressComponent'

export default class WebViewPage extends Component {
  constructor (props) {
    super(props)
    this.backPress = new BackPressComponent({backPress: (e) => this.onBack(e)})

    this.params = this.props.navigation.state.params
    this.theme = params.theme
    this.state = {
      url: this.params.url,
      title: this.params.title,
      canGoBack: false,
    }
  }

  componentDidMount () {
    this.backPress.componentDidMount()
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  /**
   * 处理安卓物理返回键
   * @param e
   * @returns {boolean}
   */
  onBack (e) {
    this.onBackPress()
    return true
  }

  onBackPress () {
    if (this.state.canGoBack) {
      this.webView.goBack()
    } else {
      NavigatorUtil.goBack(this.props.navigation)
    }
  }

  onNavigationStateChange (e) {
    this.setState({
      canGoBack: e.canGoBack
    })
  }

  render () {
    let statusBar = {
      backgroundColor: this.theme.themeColor,
    }
    return (
      <View style={GlobalStyles.root_container}>
        <NavigationBar
          title={this.params.title}
          leftButton={ViewUtils.getLeftButton(() => {
            this.onBackPress()
          })}
          statusBar={statusBar}
          style={this.theme.styles.navBar}
        />
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={(e) => {
            this.onNavigationStateChange(e)
          }}
          source={{
            uri: this.state.url
          }}
        />
      </View>
    )
  }
}