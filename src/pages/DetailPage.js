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
import FavoriteDao from '../utils/cache/FavoriteDao'

const TRENDING_URL = 'https://github.com/'
const THEME_COLOR = '#678'

export default class DetailPage extends Component {
  constructor (props) {
    super(props)
    this.params = this.props.navigation.state.params
    const { projectModel, flag } = this.params
    const { item } = projectModel
    this.favoriteDao = new FavoriteDao(flag)
    this.url = item.html_url || `${TRENDING_URL}${item.fullName}`
    const title = item.full_name || item.fullName
    this.state = {
      title,
      url: this.url,
      canGoBack: false,
      isFavorite: projectModel.isFavorite
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

  // webView状态
  onNavigationStateChange = (navState) => {
    this.setState({
      canGoBack: navState.canGoBack,
      url: navState.url,
    })
  }

  // 收藏||取消收藏
  onFavoriteButtonClick = () => {
    const { projectModel, callback } = this.params
    const isFavorite = projectModel.isFavorite = !projectModel.isFavorite
    callback(isFavorite)//更新Item的收藏状态
    this.setState({
      isFavorite
    })
    let key = projectModel.item.fullName ? projectModel.item.fullName : projectModel.item.id.toString()
    if (projectModel.isFavorite) {
      //收藏
      this.favoriteDao.saveFavoriteItem(key, JSON.stringify(projectModel.item))
    } else {
      //取消收藏
      this.favoriteDao.removeFavoriteItem(key)
    }
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

  // 渲染右侧按钮
  renderRightButton = () => {
    const { isFavorite } = this.state
    return <View style={{ flexDirection: 'row' }}>
      <TouchableOpacity
        onPress={() => this.onFavoriteButtonClick()}
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
    const titleLayoutStyle = title.length > 30 && canGoBack ? { paddingLeft: 20 } : null
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
