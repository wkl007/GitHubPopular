import React, { Component } from 'react'
import {
  View,
  DeviceInfo,
  StyleSheet,
  TouchableOpacity
} from 'react-native'
import { WebView } from 'react-native-webview'
import FontAwesome from 'react-native-vector-icons/FontAwesome'
import AntDesign from 'react-native-vector-icons/AntDesign'
import NavigationBar from '../components/NavigationBar'
import BackPressComponent from '../components/BackPressComponent'
import ViewUtil from '../utils/ViewUtil'
import NavigationUtil from '../utils/NavigationUtils'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

export default class DetailPage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { projectModel } = this.params
    this.url = projectModel.html_url || `${TRENDING_URL}${projectModel.fullName}`
    const title = projectModel.full_name || projectModel.fullName
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
      isFavorite: false
    }
    this.backPress = new BackPressComponent({ backPress: this.onBackPress })
  }

  componentDidMount () {
    this.backPress.componentDidMount()

  }

  componentWillUnmount () {
    this.backPress.componentWillUnmount()
  }

  onBackPress () {
    this.onBack()
    return true
  }

  onBack () {
    const { canGoBack } = this.state
    if (canGoBack) {
      this.webView.goBack()
    } else {
      NavigationUtil.goBack(this.props.navigation)
    }
  }

  // webView状态
  onNavigationStateChange (navState) {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    })
  }

  // 渲染左侧按钮
  renderLeftButton () {
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

  // 渲染右侧按钮
  renderRightButton () {
    const { isFavorite } = this.state
    return <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => {}}
      >
        <FontAwesome
          name={isFavorite ? 'star' : 'star-o'}
          size={20}
          style={{ color: 'white', marginRight: 10 }}
        />
      </TouchableOpacity>
    </View>
  }

  render () {
    const { title, url, canGoBack } = this.state
    const statusBar = {
      backgroundColor: THEME_COLOR,
      barStyle: 'light-content'
    }
    const titleLayoutStyle = this.state.title.length > 30 && canGoBack ? { paddingLeft: 20 } : null
    const navigationBar = <NavigationBar
      title={title}
      leftButton={this.renderLeftButton()}
      rightButton={this.renderRightButton()}
      style={{ backgroundColor: THEME_COLOR }}
      statusBar={statusBar}
      titleLayoutStyle={titleLayoutStyle}
    />
    return (
      <View style={styles.container}>
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
