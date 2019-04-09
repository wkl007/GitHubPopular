import React, { Component } from 'react'
import {
  View,
} from 'react-native'
import { WebView } from 'react-native-webview'
import AntDesign from 'react-native-vector-icons/AntDesign'
import SafeAreaViewPlus from '../components/SafeAreaViewPlus'
import NavigationBar from '../components/NavigationBar'
import BackPressComponent from '../components/BackPressComponent'
import ViewUtil from '../utils/ViewUtil'
import NavigationUtil from '../utils/NavigationUtil'
import GlobalStyles from '../assets/styles/GlobalStyles'

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
    const { theme } = this.params
    const statusBar = {
      backgroundColor: theme.themeColor,
      barStyle: 'light-content'
    }
    const titleLayoutStyle = title.length > 30 && canGoBack ? { paddingLeft: 20 } : null
    const navigationBar = <NavigationBar
      title={title}
      statusBar={statusBar}
      leftButton={this.renderLeftButton()}
      style={theme.styles.navBar}
      titleLayoutStyle={titleLayoutStyle}
    />
    return (
      <SafeAreaViewPlus
        style={GlobalStyles.root_container}
        topColor={theme.themeColor}
      >
        {navigationBar}
        <WebView
          ref={webView => this.webView = webView}
          startInLoadingState={true}
          onNavigationStateChange={e => this.onNavigationStateChange(e)}
          source={{ uri: url }}
        />
      </SafeAreaViewPlus>
    )
  }
}
