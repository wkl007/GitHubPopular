import React, { Component } from 'react'
import {
  View,
  DeviceInfo,
  StyleSheet
} from 'react-native'
import { WebView } from 'react-native-webview'
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigationBar from '../components/NavigationBar'
import BackPressComponent from '../components/BackPressComponent'
import ViewUtil from '../utils/ViewUtil'
import NavigationUtil from '../utils/NavigationUtil'
import GlobalStyles from '../assets/styles/GlobalStyles'

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
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }

  componentDidMount () {
    this.backPress.componentDidMount()
  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()

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

  onNavigationStateChange (navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    })
  }

  // 渲染左侧按钮
  renderLeftButton = () => {
    const { canGoBack } = this.state
    return <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {ViewUtil.getLeftBackButton(() => {this.onBackPress()})}
      {canGoBack && <AntDesign
        name='close'
        size={26}
        style={{ color: 'white', marginLeft: 2 }}
        onPress={() => {NavigationUtil.goBack(this.props.navigation)}}
      />}
    </View>
  }

  render () {
    const { title, url, canGoBack } = this.state
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const titleLayoutStyle = title.length > 30 && canGoBack ? { paddingLeft: 20 } : null
    const navigationBar = <NavigationBar
      title={title}
      statusBar={statusBar}
      leftButton={this.renderLeftButton()}
      style={{ backgroundColor: THEME_COLOR }}
      titleLayoutStyle={titleLayoutStyle}
    />
    return (
      <View style={GlobalStyles.root_container}>
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: url }}
        />
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
